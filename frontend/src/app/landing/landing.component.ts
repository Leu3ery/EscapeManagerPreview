import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

const COPY = {
  ua: {
    nav: {
      cta: 'Запросити демо',
    },
    hero: {
      eyebrow: 'SaaS для квест-кімнат',
      title: 'Escape Manager — система керування квест-кімнатами',
      subtitle:
        'Відкривайте ігрові сесії за секунди, збирайте дані клієнтів без паперу, зберігайте історію та контролюйте роботу адмінів.',
      ctaPrimary: 'Запросити демо',
      ctaSecondary: 'Стати пілотом',
      ctaLink: 'Інформація про пілотну версію',
    },
    how: {
      title: 'Як це працює',
      steps: [
        'Адмін відкриває кімнату і отримує 4-значний код',
        'Гравці заповнюють форму (поля + підпис/фото)',
        'Результат та згода зберігаються в системі',
      ],
    },
    features: {
      sessions: {
        title: 'Кімнати / сесії — серце процесу',
        text: 'Код для учасників, список гравців, додавання клієнтів і завершення сесії — все в одному місці.',
      },
      clients: {
        title: 'База клієнтів та історія відвідувань',
        text: 'Зберігайте контактні дані, бачте кількість ігор, загальний час і останній візит кожного клієнта.',
      },
      campaigns: {
        title: 'Повернення неактивних клієнтів через email-кампанії',
        text: 'Відстежуйте клієнтів, які давно не повертались, формуйте сегмент і запускайте автоматичну розсилку для win-back.',
      },
      account: {
        title: 'Особистий кабінет гравця',
        text: 'Гравці бачать статистику, історію і досягнення — це мотивує повертатися знову.',
      },
      fields: {
        title: 'Налаштуйте поля реєстрації під себе',
        text: 'Увімкніть потрібні дефолтні поля й додайте кастомні — під вашу локацію та правила.',
      },
      templates: {
        title: 'Згоди та шаблони — без паперу',
        text: 'Зберігайте текст з плейсхолдерами, прев’ю PDF та друк, налаштування підпису (учасник / батьки).',
      },
      admins: {
        title: 'Ролі та доступи для адміністраторів',
        text: 'Додавайте адмінів і керуйте доступом до локацій та правами.',
      },
      audit: {
        title: 'Повна прозорість: журнал дій',
        text: 'Хто, що і коли зробив — і можливість відкату дозволених дій (залежно від ролі).',
      },
      stats: {
        title: 'Аналітика для росту',
        text: 'Популярність ігор, середній час проходження, динаміка клієнтів — щоб приймати рішення на даних.',
      },
      nfc: {
        title: 'NFC-картки для швидкого доступу',
        text: 'Призначайте картки клієнтам, записуйте доступ та керуйте наявністю. Доступ одним дотиком.',
      },
    },
    pilot: {
      title: 'Шукаємо 3–5 локацій для пілоту',
      text: 'Покажемо демо, зберемо фідбек і зробимо продукт під ваш процес.',
      button: 'Дізнатись більше',
    },
    form: {
      title: 'Запросити демо',
      note: 'CRM інтеграції можна додати пізніше — зараз просто короткий запит на демо.',
      name: 'Ім’я',
      email: 'Email',
      company: 'Компанія',
      submit: 'Надіслати запит',
      success: 'Дякуємо! Ми зв’яжемося з вами найближчим часом.',
      error: 'Сталася помилка. Спробуйте ще раз.',
    },
    footer: {
      note: 'Створено для квест-кімнат · Без паперу · Повний контроль адмінів',
    },
  },
  de: {
    nav: {
      cta: 'Demo anfragen',
    },
    hero: {
      eyebrow: 'SaaS für Escape Rooms',
      title: 'Escape Manager — Software für Escape Rooms',
      subtitle:
        'Starten Sie Sessions in Sekunden, erfassen Sie Kundendaten papierlos, behalten Sie Historie und volle Kontrolle über Admin-Aktionen.',
      ctaPrimary: 'Demo anfragen',
      ctaSecondary: 'Pilot werden',
      ctaLink: 'Information über Pilot Version',
    },
    how: {
      title: 'So funktioniert’s',
      steps: [
        'Admin startet eine Session und erhält einen 4-stelligen Code',
        'Spieler füllen das Formular aus (Felder + Unterschrift/Foto)',
        'Ergebnisse und Einwilligungen werden gespeichert',
      ],
    },
    features: {
      sessions: {
        title: 'Sessions — der Kernprozess',
        text: 'Code für Teilnehmer, Spielerliste, Kunden hinzufügen und Session abschließen — alles an einem Ort.',
      },
      clients: {
        title: 'Kundenbasis & Besuchshistorie',
        text: 'Speichern Sie Kontaktdaten und sehen Sie Spiele, Gesamtzeit und letzten Besuch pro Kunde.',
      },
      campaigns: {
        title: 'Inaktive Kunden mit E-Mail-Kampagnen zurückholen',
        text: 'Erkennen Sie Kunden mit langer Pause, segmentieren Sie sie und starten Sie automatische Win-back-Kampagnen.',
      },
      account: {
        title: 'Persönliches Spieler-Konto',
        text: 'Spieler sehen Statistik, Historie und Erfolge — das erhöht die Wiederkehr.',
      },
      fields: {
        title: 'Registrierungsfelder flexibel anpassen',
        text: 'Aktivieren Sie Standardfelder und fügen Sie eigene Felder hinzu — passend zu Ihrer Location.',
      },
      templates: {
        title: 'Einwilligungen & Vorlagen — ohne Papier',
        text: 'Text mit Platzhaltern, PDF-Vorschau & Druck, Unterschrift-Einstellungen (Teilnehmer / Eltern).',
      },
      admins: {
        title: 'Admin-Rollen & Rechte',
        text: 'Admins hinzufügen und Zugriffe auf Locations sowie Rechte verwalten.',
      },
      audit: {
        title: 'Transparenz: Audit-Log',
        text: 'Wer hat was wann gemacht — inkl. Rollback für erlaubte Aktionen (rollenbasiert).',
      },
      stats: {
        title: 'Analytics für Wachstum',
        text: 'Spiel-Popularität, durchschnittliche Zeit, Kundenwachstum — datenbasierte Entscheidungen.',
      },
      nfc: {
        title: 'NFC-Karten für schnellen Zugriff',
        text: 'Karten zuweisen, Zugriff schreiben und Bestand verwalten. Login per Tap.',
      },
    },
    pilot: {
      title: 'Wir suchen 3–5 Pilot-Locations',
      text: 'Demo zeigen, Feedback sammeln und das Produkt an Ihren Prozess anpassen.',
      button: 'Mehr erfahren',
    },
    form: {
      title: 'Demo anfragen',
      note: 'CRM-Integrationen können später kommen — jetzt reicht eine kurze Demo-Anfrage.',
      name: 'Name',
      email: 'Email',
      company: 'Unternehmen',
      submit: 'Anfrage senden',
      success: 'Danke! Wir melden uns in Kürze.',
      error: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.',
    },
    footer: {
      note: 'Entwickelt für Escape Rooms · Papierlos · Volle Admin-Kontrolle',
    },
  },
  en: {
    nav: {
      cta: 'Request demo',
    },
    hero: {
      eyebrow: 'SaaS for escape rooms',
      title: 'Escape Manager — software for escape rooms',
      subtitle:
        'Start sessions in seconds, collect customer data without paper, keep full history, and stay in control of admin actions.',
      ctaPrimary: 'Request demo',
      ctaSecondary: 'Become a pilot',
      ctaLink: 'Information about Pilot version',
    },
    how: {
      title: 'How it works',
      steps: [
        'Admin opens a session and gets a 4-digit code',
        'Players fill in the form (fields + signature/photo)',
        'Results and consent are stored automatically',
      ],
    },
    features: {
      sessions: {
        title: 'Sessions — the core workflow',
        text: 'Participant code, player list, add clients, and close the session — all in one place.',
      },
      clients: {
        title: 'Client database & visit history',
        text: 'Store contacts and see games played, total time, and last visit for each client.',
      },
      campaigns: {
        title: 'Bring inactive clients back with email campaigns',
        text: 'Identify clients who have not returned in a while, build a segment, and run automated win-back campaigns.',
      },
      account: {
        title: 'Personal player account',
        text: 'Players see stats, history, and achievements — driving repeat visits.',
      },
      fields: {
        title: 'Customize registration fields',
        text: 'Enable default fields and add custom ones — tailored to your location and rules.',
      },
      templates: {
        title: 'Consent & templates — paperless',
        text: 'Placeholder-based templates, PDF preview & print, signature settings (participant / parent).',
      },
      admins: {
        title: 'Admin roles & permissions',
        text: 'Add admins and manage location access and permissions.',
      },
      audit: {
        title: 'Full transparency: audit log',
        text: 'Who did what and when — with rollback for allowed actions (role-based).',
      },
      stats: {
        title: 'Analytics for growth',
        text: 'Game popularity, average completion time, client growth — make data-driven decisions.',
      },
      nfc: {
        title: 'NFC cards for instant access',
        text: 'Assign cards, write access, manage inventory. Tap-to-login experience.',
      },
    },
    pilot: {
      title: 'Looking for 3–5 pilot locations',
      text: 'We’ll show a demo, gather feedback, and tailor the product to your workflow.',
      button: 'Get more info',
    },
    form: {
      title: 'Request a demo',
      note: 'CRM integrations can come later — for now a short demo request is enough.',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      submit: 'Send request',
      success: 'Thanks! We will reach out shortly.',
      error: 'Something went wrong. Please try again.',
    },
    footer: {
      note: 'Built for Escape Rooms · Paperless sessions · Full admin control',
    },
  },
} as const;

type Lang = keyof typeof COPY;
type FeatureKey = keyof (typeof COPY)['ua']['features'];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  readonly langs: Lang[] = ['ua', 'de', 'en'];
  lang: Lang = 'en';
  submitted = false;
  isSubmitting = false;
  submitError = '';
  lightboxImage: string | null = null;
  lightboxAlt = '';

  readonly howImages = [
    'rooms.png',
    'registrations_fields.png',
    'clients.png',
  ];

  readonly featureSections: Array<{
    key: FeatureKey;
    images: string[];
    reverse?: boolean;
    frame?: 'laptop' | 'phone';
  }> = [
    { key: 'sessions', images: ['sessions_fullscrean.png'] },
    { key: 'clients', images: ['clients.png'], reverse: true },
    { key: 'campaigns', images: ['email_campaigns.png'] },
    { key: 'account', images: ['user_account1.png', 'user_account2.png'], frame: 'phone' },
    { key: 'fields', images: ['registrations_fields.png'], reverse: true },
    { key: 'templates', images: ['templates.png'] },
    { key: 'admins', images: ['admins.png'], reverse: true },
    { key: 'audit', images: ['audit_log.png'] },
    { key: 'stats', images: ['statistics.png'], reverse: true },
  ];

  readonly nfcImages = ['nfc_card_preview.png', 'nfc_cards.png'];

  constructor(private readonly http: HttpClient) {}

  get copy() {
    return COPY[this.lang];
  }

  get howSteps(): string[] {
    return [...this.copy.how.steps];
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem('lang') as Lang | null;
    if (stored && this.langs.includes(stored)) {
      this.lang = stored;
    }
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', lang);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightboxImage) {
      this.closeLightbox();
    }
  }

  openLightbox(src: string, alt: string): void {
    this.lightboxImage = src;
    this.lightboxAlt = alt;
    if (typeof document !== 'undefined') {
      document.body.classList.add('no-scroll');
    }
  }

  closeLightbox(): void {
    this.lightboxImage = null;
    this.lightboxAlt = '';
    if (typeof document !== 'undefined') {
      document.body.classList.remove('no-scroll');
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      name: form.value.name,
      email: form.value.email,
      company: form.value.company,
      lang: this.lang,
    };

    this.http
      .post('/api/leads', payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.submitted = true;
          form.resetForm();
        },
        error: () => {
          this.submitError = this.copy.form.error;
        },
      });
  }
}
