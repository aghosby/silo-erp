import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@services/utils/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CopilotResponse {
  reply: string;
  intent?: {
    primary: string;
    secondary?: string;
    confidence?: number;
    filters?: Record<string, any>;
  };
  sources?: string[];
  mutation?: {
    action: string;
    entity: string;
  };
  result?: {
    ok: boolean;
    message: string;
    count?: number;
  };
  conversationId: string;
  model: string;
  resolvedRole: string;
  downloadUrl?: string;
  downloadLabel?: string;
  reportType?: string;
  error?: string;
}

interface Suggestion {
  suggestions: string[];
}

@Component({
  selector: 'app-zera-copilot',
  templateUrl: './zera-copilot.component.html',
  styleUrls: ['./zera-copilot.component.scss'],
})
export class ZeraCopilotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // State
  isOpen = false;
  messages: Message[] = [];
  inputValue = '';
  isLoading = false;
  conversationId: string | null = null;
  suggestions: string[] = [];
  downloadLink: { url: string; label: string } | null = null;

  // Props - injected from parent or AuthService
  @Input() companyId: string | null = null;
  @Input() userId: string | null = null;

  // Logged in user from AuthService
  loggedInUser: any;

  // Track if we should auto-scroll
  private shouldScroll = true;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.loadSuggestions();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ───────────────────────────────────────────────────────────────
  // Core interactions
  // ───────────────────────────────────────────────────────────────

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.loadSuggestions();
    }
    if (this.isOpen) {
      this.shouldScroll = true;
    }
  }

  close(): void {
    this.isOpen = false;
  }

  async sendMessage(msg?: string): Promise<void> {
    const message = msg ? msg.trim() : this.inputValue.trim();

    if (!message || this.isLoading) {
      return;
    }

    // Add user message to UI
    this.messages.push({ role: 'user', content: message });
    this.inputValue = '';
    this.isLoading = true;
    this.downloadLink = null;
    this.shouldScroll = true;

    try {
      // Build request
      const body: any = {
        message,
        conversationHistory: this.messages.slice(0, -1),
      };

      if (this.conversationId) {
        body.conversationId = this.conversationId;
      }

      // Priority 1: Use loggedInUser from AuthService
      if (this.loggedInUser) {
        // For super_admin - use companyId (could be their own company ID)
        if (this.loggedInUser.isSuperAdmin) {
          body.companyId = this.loggedInUser._id;
        } else {
          body.userId = this.loggedInUser._id;
        }
      }

      // Priority 2: Fallback to component @Input properties if loggedInUser not available
      if (!body.companyId && this.companyId) {
        body.companyId = this.companyId;
      }
      if (!body.userId && this.userId) {
        body.userId = this.userId;
      }

      // Validation - at least one identifier must be present
      if (!body.companyId && !body.userId) {
        throw new Error('User identification failed. Please log in again.');
      }

      console.log('Sending payload:', body);

      const response = await this.http
        .post<CopilotResponse>(`${environment.aiBaseUrl}/copilot/chat`, body)
        .toPromise();

      if (response?.reply) {
        // Store conversation ID for follow-ups
        if (response.conversationId) {
          this.conversationId = response.conversationId;
        }

        // Add assistant response
        this.messages.push({ role: 'assistant', content: response.reply });
        this.shouldScroll = true;

        // Handle download link with proper label based on reportType
        if (response.downloadUrl) {
            let fullUrl = response.downloadUrl;
          
            if (!fullUrl.startsWith('http')) {
              const base = environment.aiBaseUrl.replace(/\/$/, ''); // remove trailing slash
              const path = fullUrl.replace(/^\/api/, ''); // remove leading /api
          
              fullUrl = `${base}${path}`;
            }
          
            const reportType = response.reportType || 'Report';
            const label = this.generateDownloadLabel(reportType);
          
            this.downloadLink = {
              url: fullUrl,
              label: label,
            };
          }

        // Handle automatic navigation based on intent
        if (response.intent?.primary) {
          this.handleIntentNavigation(response.intent.primary);
        }

        // Trigger refetch if it was a mutation
        if (response.mutation?.action) {
          this.handleMutation(response.mutation, response.result);
        }
      }
    } catch (err: any) {
      const errorMsg =
        err?.error?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      this.messages.push({ role: 'assistant', content: errorMsg });
      this.shouldScroll = true;
    } finally {
      this.isLoading = false;
    }
  }

  selectSuggestion(suggestion: string): void {
    this.sendMessage(suggestion);
  }

  downloadCSV(): void {
    if (this.downloadLink) {
      // Construct the full URL if it's relative
      let downloadUrl = this.downloadLink.url;
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = `${environment.aiBaseUrl}${downloadUrl}`;
      }

      console.log({downloadUrl})

      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.generateFileName(this.downloadLink.label);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);

      console.log(`Downloading: ${link.download} from ${downloadUrl}`);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Download helpers
  // ───────────────────────────────────────────────────────────────

  private generateDownloadLabel(reportType: string): string {
    // Clean up the report type
    const cleaned = reportType
      .trim()
      .replace(/CSV$/i, '') // Remove trailing CSV
      .trim();

    // Capitalize first letter
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    return `Download ${capitalized} CSV`;
  }

  private generateFileName(label: string): string {
    // Extract report type from label: "Download {Type} CSV" -> "{Type}.csv"
    const match = label.match(/Download\s+(.+?)\s+CSV/i);
    if (match && match[1]) {
      return `${match[1].replace(/\s+/g, '_')}.csv`;
    }
    return 'download.csv';
  }

  // ───────────────────────────────────────────────────────────────
  // Intent-based Navigation
  // ───────────────────────────────────────────────────────────────

  private handleIntentNavigation(primary: string): void {
    const intent = primary.toLowerCase().trim();

    // Map intent to route
    const intentRoutes: { [key: string]: string } = {
      employees: 'app/hr/employees',
      employee: 'app/hr/employees',
      payroll: 'app/hr/payroll',
      salary: 'app/hr/payroll',
      absences: 'app/hr/leave-management',
      absence: 'app/hr/leave-management',
      leave: '/app/hr/leave-management',
      expenses: '/app/hr/expense-management',
      expense: '/app/hr/expense-management',
      reports: '/app/hr/reports',
      report: '/app/hr/reports',
      appraisals: '/app/hr/appraisals',
      appraisal: '/app/hr/appraisals',
      meetings: '/app/hr/calender',
      meeting: '/app/hr/calender',
      recruitment: '/app/hr/recruitment',
      recruitments: '/app/hr/recruitment',
      applications: '/app/hr/recruitment',
      application: '/app/hr/recruitment',
      announcements: '/app/hr/notice-board',
      announcement: '/app/hr/notice-board',
      notice: '/app/hr/notice-board',

    };

    const route = intentRoutes[intent];
    if (route) {
      console.log(`Navigating to ${route} based on intent: ${primary}`);
      this.router.navigate([route]);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Load suggestions
  // ───────────────────────────────────────────────────────────────

  private loadSuggestions(): void {
    this.http
      .get<Suggestion>(`${environment.aiBaseUrl}/copilot/suggestions`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.suggestions = response.suggestions.slice(0, 4);
        },
        error: (err) => {
          console.warn('Failed to load copilot suggestions:', err);
          this.suggestions = [
            'How many employees do we have?',
            'Show all pending leave requests',
            'What was total payroll this month?',
            'List all pending expenses',
          ];
        },
      });
  }

  // ───────────────────────────────────────────────────────────────
  // Mutation handler
  // ───────────────────────────────────────────────────────────────

  private handleMutation(
    mutation: { action: string; entity: string },
    result?: { ok: boolean; message: string; count?: number }
  ): void {
    if (result?.ok) {
      console.log(
        `✓ Mutation success: ${mutation.action} ${mutation.entity}`,
        result
      );
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Scroll to bottom (only when needed)
  // ───────────────────────────────────────────────────────────────

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      // ignore
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────

  trackByIndex(index: number): number {
    return index;
  }
}