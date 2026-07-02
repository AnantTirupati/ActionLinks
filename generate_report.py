import os
from fpdf import FPDF

class ActionableLinksReport(FPDF):
    def __init__(self):
        super().__init__()
        # Set margins: Left=20mm, Top=20mm, Right=20mm
        self.set_left_margin(20)
        self.set_right_margin(20)
        self.set_top_margin(20)
        self.set_auto_page_break(auto=True, margin=20)
        
    def header(self):
        # Suppress header on the cover page (page 1)
        if self.page_no() == 1:
            return
        
        # Draw top accent bar
        self.set_fill_color(30, 41, 59) # Slate 800
        self.rect(0, 0, 210, 8, "F")
        
        # Header text
        self.set_font("helvetica", "I", 8)
        self.set_text_color(100, 116, 139) # Cool Gray
        self.cell(0, 10, "Actionable Links |  Technical Report ", border=0, align="R")
        self.ln(12)
        
    def footer(self):
        # Suppress footer on cover page
        if self.page_no() == 1:
            return
            
        # Draw a thin footer line
        self.set_draw_color(226, 232, 240) # Gray 200
        self.set_line_width(0.3)
        self.line(20, 282, 190, 282)
        
        # Footer text
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(148, 163, 184) # Slate 400
        self.cell(0, 10, f"Page {self.page_no()}", border=0, align="C")

def create_report(output_path):
    pdf = ActionableLinksReport()
    pdf.add_page()
    
    # ----------------------------------------------------
    # COVER PAGE
    # ----------------------------------------------------
    # Large colored top band
    pdf.set_fill_color(30, 41, 59) # Slate 800
    pdf.rect(0, 0, 210, 90, "F")
    
    # Tiny accent line
    pdf.set_fill_color(59, 130, 246) # Blue 500
    pdf.rect(0, 90, 210, 5, "F")
    
    # Title on the banner
    pdf.set_y(25)
    pdf.set_font("helvetica", "B", 34)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 15, "ACTIONABLE LINKS", border=0, align="L")
    pdf.ln(15)
    
    # Subtitle
    pdf.set_font("helvetica", "", 14)
    pdf.set_text_color(191, 219, 254) # Blue 200
    pdf.cell(0, 10, "Transforming Documentation into Live Web Walkthroughs", border=0, align="L")
    pdf.ln(10)
    
    # Tagline
    pdf.set_font("helvetica", "I", 11)
    pdf.set_text_color(148, 163, 184) # Slate 400
    pdf.cell(0, 10, "AI-Driven Interactive Action Guidance Engine & Chrome Overlay Player", border=0, align="L")
    pdf.ln(45)
    
    # Main Body on Cover Page
    pdf.set_y(105)
    pdf.set_font("helvetica", "B", 18)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 12, "STARTUP BUSINESS & TECHNICAL REPORT", border=0, align="L")
    pdf.ln(15)
    
    pdf.set_font("helvetica", "", 11)
    pdf.set_text_color(51, 65, 85) # Slate 700
    summary_text = (
        "Actionable Links solves the user onboarding and software guidance crisis. "
        "By dynamically parsing web layouts and visual documentation via Gemini 2.5 Flash, "
        "the platform converts YouTube videos, static guides, and recording files into interactive, "
        "real-time DOM walkthroughs. Built with a dual-engine architecture consisting of a Next.js "
        "Creator Console and a lightweight Shadow-DOM isolated Chrome Extension, it offers instant "
        "guidance overlays directly on target web interfaces without a single line of customer integration code."
    )
    pdf.multi_cell(0, 6, summary_text)
    pdf.ln(10)
    
    # Key Highlights
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 8, "Key Platform Advantages:", border=0, align="L")
    pdf.ln(8)
    
    pdf.set_font("helvetica", "", 10)
    highlights = [
        "Zero-code Client Integration: Renders overlays on any SaaS web portal via Chrome Extension.",
        "AI-Generated Guides: Converts YouTube and documentation into step actions in under 10 seconds.",
        "Precision Spotlight Overlay: Isolates elements using custom SVG masking and real-time DOM polling.",
        "Enterprise-ready Backend: Integrated with Supabase auth, progress synchronization, and RLS rules."
    ]
    for h in highlights:
        pdf.set_text_color(59, 130, 246)
        pdf.cell(5, 6, chr(149), border=0, align="L")
        pdf.set_text_color(51, 65, 85)
        pdf.cell(0, 6, h, border=0, align="L")
        pdf.ln(6)
        
    pdf.ln(15)
    
    # Metadata Block at bottom
    pdf.set_y(220)
    pdf.set_draw_color(226, 232, 240)
    pdf.set_line_width(0.5)
    pdf.line(20, 220, 190, 220)
    pdf.ln(6)
    
    metadata = [
        ("PROJECT STATUS", "Prototype Complete"),
        ("TECH STACK", "Next.js 15, Vite, React 18, Supabase SSR, Gemini 2.5 Flash, TypeScript"),
        ("DEPLOYMENT SLATE", "Vercel + Chrome Web Store + Supabase Cloud"),
        ("AUTHOR/TEAM", "Team Local Host"),
        ("DATE", "July 2, 2026")
    ]
    
    for label, val in metadata:
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(45, 6, label + ":", border=0)
        pdf.set_font("helvetica", "", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 6, val, border=0)
        pdf.ln(6)

    # ----------------------------------------------------
    # PAGE 2: TECH STACK & SYSTEM ARCHITECTURE
    # ----------------------------------------------------
    pdf.add_page()
    
    # Section Header
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, "1. Comprehensive Technology Stack", border=0, align="L")
    pdf.ln(12)
    
    # Detailed Tech Stack Breakdown
    tech_data = [
        ("Component", "Technology", "Role & Engineering Decisions"),
        ("Creator App", "Next.js 15 (App Router)", "Enables server components, fast routing, and Server Actions for tutorial CRUD. Lowers startup overhead."),
        ("Extension", "Vite + React + TS", "Builds highly optimized, lightweight bundles. ES Modules dynamic loading handles injection in sandboxed webpages."),
        ("Database", "Supabase PostgreSQL", "Provides scalable schema with full Row Level Security (RLS) policies. Powers rapid auth mapping."),
        ("Authentication", "Supabase SSR Auth", "Unifies cookie sessions between Next.js and Chrome Extension on cross-origin API calls."),
        ("AI Orchestrator", "Gemini 2.5 Flash", "Extracts structured instructions and matches them to page selectors via JSON schema validation."),
        ("Styling", "Tailwind CSS + Custom CSS", "Used for both web dashboards and inside Shadow-DOM containers to isolate extension styles.")
    ]
    
    # Draw Table
    pdf.set_font("helvetica", "B", 9)
    pdf.set_fill_color(241, 245, 249) # Light gray
    pdf.set_text_color(30, 41, 59)
    
    widths = [25, 45, 100]
    row_height = 8
    
    # Table Header
    for idx, col in enumerate(tech_data[0]):
        pdf.cell(widths[idx], row_height, col, border=1, align="L", fill=True)
    pdf.ln(row_height)
    
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_text_color(51, 65, 85)
    for row in tech_data[1:]:
        # multi-cell simulation for height calculation
        # To keep it simple, we just use standard cells
        pdf.cell(widths[0], row_height, row[0], border=1, align="L")
        pdf.cell(widths[1], row_height, row[1], border=1, align="L")
        pdf.cell(widths[2], row_height, row[2], border=1, align="L")
        pdf.ln(row_height)
        
    pdf.ln(12)
    
    # System Architecture Header
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, "2. System Architecture & Flows", border=0, align="L")
    pdf.ln(10)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(51, 65, 85)
    arch_desc = (
        "The system relies on asynchronous message passing and secure database gateways. "
        "The Chrome Extension functions on client pages by querying the Next.js API for the current hostname. "
        "Here is the system communications flow mapping:"
    )
    pdf.multi_cell(0, 6, arch_desc)
    pdf.ln(6)
    
    # ASCII System Architecture diagram
    pdf.set_font("courier", "", 8.5)
    pdf.set_fill_color(248, 250, 252) # Slate 50
    pdf.set_text_color(15, 23, 42)
    
    diagram = (
        "  +------------------------------------------------------------+\n"
        "  |                   CHROME EXTENSION PLAYER                  |\n"
        "  |                                                            |\n"
        "  |  [Popup Dashboard]                                         |\n"
        "  |        | (tabs.sendMessage)                                |\n"
        "  |        v                                                   |\n"
        "  |  [Content Script (Shadow DOM)] <-> [DOM Observer]          |\n"
        "  |        |                            (MutationObserver)     |\n"
        "  |        | (runtime.sendMessage)                             |\n"
        "  |        v                                                   |\n"
        "  |  [Background Service Worker] <----> [Chrome Local Storage] |\n"
        "  +--------+---------------------------------------------------+\n"
        "           |                                                    \n"
        "           | HTTP Request (with CORS & Credentials)             \n"
        "           v                                                    \n"
        "  +--------+---------------------------------------------------+\n"
        "  |                 NEXT.JS APP BACKEND / GATEWAY              |\n"
        "  |                                                            |\n"
        "  |  [CORS Handler] --> [Server Routes (/api/v1/*)]            |\n"
        "  |                            |                               |\n"
        "  |                            +---> [Supabase Client]         |\n"
        "  |                            |           | (PostgreSQL RLS)  |\n"
        "  |                            |           v                   |\n"
        "  |                            |     [(DB) Supabase Database]  |\n"
        "  |                            v                               |\n"
        "  |                      [Gemini 2.5 AI Pipeline]              |\n"
        "  +----------------------------+-------------------------------+\n"
        "                               |                               "
    "                                                    [Google Generative Language]                 \n"
    )
    
    pdf.set_draw_color(203, 213, 225)
    # Write multi-line preformatted text
    pdf.multi_cell(0, 4.5, diagram, border=1, fill=True)
    pdf.ln(10)

    # ----------------------------------------------------
    # PAGE 3: CORE IMPLEMENTATION HIGHLIGHTS
    # ----------------------------------------------------
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, "3. Core Engineering Highlights", border=0, align="L")
    pdf.ln(12)
    
    highlights_list = [
        ("Shadow DOM Isolation", 
         "Web walkthrough engines suffer from style contamination where host website CSS breaks "
         "the overlay layouts. We solved this by attaching a Shadow Root in content.ts. All styling "
         "is loaded dynamically inside this isolated root via Web Accessible Resources, shielding the HUD player "
         "from host overrides and protecting host websites from extension side-effects."),
        
        ("Pulsing Spotlight SVG Cutout", 
         "To create high-premium visual isolation without blocking interactions, we implemented "
         "an SVG-based Spotlight overlay. Rather than layering simple border highlights, the spotlight component "
         "dynamically fetches the bounding rect coordinates of the target element, pads the coordinates by 6px, "
         "and recalculates an SVG mask cutout in real-time, matching the window scroll and viewport resize events."),
        
        ("Asynchronous DOM Observer", 
         "Single Page Apps (SPAs) re-render parts of the page dynamically, causing target selectors "
         "to disappear or load lazily. Our DomObserver script starts a MutationObserver listening to "
         "body child additions. If a step target selector was missing but gets injected into the DOM, "
         "the player automatically recovers and resumes highlighting, creating a seamless user experience."),
        
        ("Secure Cross-Origin (CORS) Cookie Authentication", 
         "Extensions communicate with servers across domains, which browsers block by default. "
         "We custom-coded a robust CORS response mapping system inside Next.js APIs to echo the extension's origin, "
         "set Access-Control-Allow-Credentials, and read encrypted Supabase JWT cookies. This permits direct "
         "progress-syncs and active session checks directly from background service workers.")
    ]
    
    for title, desc in highlights_list:
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(59, 130, 246) # Blue 500
        pdf.cell(0, 8, chr(187) + " " + title, border=0)
        pdf.ln(8)
        
        pdf.set_font("helvetica", "", 10)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5.5, desc)
        pdf.ln(6)
        
    pdf.ln(10)
    
    # ----------------------------------------------------
    # PAGE 4: ROADMAP FOR REAL-WORLD DEPLOYMENT
    # ----------------------------------------------------
    pdf.add_page()
    
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, "4. Real-world Deployment Roadmap", border=0, align="L")
    pdf.ln(12)
    
    roadmap_phases = [
        ("Phase 1: Foundation & Community Launch (Months 1 - 3)",
         "Goal: Validate developer traction and product-market fit.",
         [
             "Publish the extension to the Chrome Web Store with open developer access.",
             "Enable self-hosted Next.js application deployments via single-click Vercel integration.",
             "Integrate Google Gemini 2.5 Flash pipeline with rate-limiting and user API key support.",
             "Set up database replication and monitoring on Supabase Cloud."
         ]),
        ("Phase 2: Enterprise Security & Analytics (Months 4 - 6)",
         "Goal: Adapt platform for corporate SaaS and team-based walkthrough management.",
         [
             "Introduce SOC-2 and HIPAA compliance guidelines for DOM scraping and recording.",
             "Add Telemetry and Analytics dashboards: track walkthrough completion rates and drop-off steps.",
             "Enable Role-Based Access Control (RBAC): team workspaces, editors, and reviewers.",
             "Provide customized branding options: allow companies to customize spotlight colors, HUD logo, and layout fonts."
         ]),
        ("Phase 3: Advanced Automation & Marketplace (Months 7 - 12)",
         "Goal: Transition Actionable Links into a web automation ecosystem.",
         [
             "Launch a Public Guide Marketplace: allow creators to monetize tutorials for complex platforms.",
             "AI Auto-Healer: use Gemini to automatically fix broken CSS selectors when host websites deploy updates.",
             "Cross-Browser Support: release Safari (WebExtension), Firefox, and Edge equivalents.",
             "Action Hooks: trigger webhooks or custom code execution when specific walkthrough steps are completed."
         ])
    ]
    
    for title, subtitle, bullets in roadmap_phases:
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(0, 8, title, border=0)
        pdf.ln(7)
        
        pdf.set_font("helvetica", "I", 9.5)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(0, 6, subtitle, border=0)
        pdf.ln(7)
        
        pdf.set_font("helvetica", "", 9.5)
        pdf.set_text_color(51, 65, 85)
        for bullet in bullets:
            pdf.set_text_color(59, 130, 246)
            pdf.cell(6, 5.5, "-", border=0, align="R")
            pdf.set_text_color(51, 65, 85)
            pdf.cell(0, 5.5, " " + bullet, border=0)
            pdf.ln(5.5)
        pdf.ln(8)
        
    # Startup Pitch/Business Model
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, "5. Startup Monetization Strategy", border=0, align="L")
    pdf.ln(10)
    
    monetization = (
        "Actionable Links will operate on a Freemium SaaS model. "
        "The base platform is free for open-source and individual developers (up to 3 public guides). "
        "The Enterprise Tier starts at $49/month, unlocking private guides, progress analytics, "
        "team workspaces, and AI selector-healing capabilities. Special corporate custom licensing "
        "will support on-premise configurations and private Supabase database integrations."
    )
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.multi_cell(0, 6, monetization)
    
    # Save Report
    pdf.output(output_path)

if __name__ == "__main__":
    report_file = "e:\\ActionLinks\\actionable_links_project_report.pdf"
    create_report(report_file)
    print(f"Report generated successfully at: {report_file}")
