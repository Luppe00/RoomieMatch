import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'da';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLang = new BehaviorSubject<Language>(this.getStoredLanguage());
    public currentLang$ = this.currentLang.asObservable();

    private translations: Record<Language, Record<string, string>> = {
        en: {
            // Navbar
            'nav.dashboard': 'Dashboard',
            'nav.explore': 'Explore',
            'nav.matches': 'Matches',
            'nav.profile': 'Profile',
            'nav.login': 'Login',
            'nav.register': 'Register',
            'nav.logout': 'Log out',

            // Landing Page
            'landing.title': 'Find Your Perfect',
            'landing.titleHighlight': 'Roommate',
            'landing.description': 'RoomieMatch connects people looking for rooms with those who have rooms to rent. Smart matching, verified profiles, and a seamless experience.',
            'landing.cta': 'Get started now - it\'s free',
            'landing.feature1': 'Verified profiles',
            'landing.feature2': 'Smart matching',
            'landing.feature3': 'Built-in chat',
            'landing.stat1': 'Active Listings',
            'landing.stat2': 'New listings / week',
            'landing.stat3': 'Successful matches',
            'landing.howTitle': 'How It Works',
            'landing.howSubtitle': 'Find your next roommate in three simple steps',
            'landing.step1Title': 'Create Profile',
            'landing.step1Desc': 'Sign up and tell us about yourself and what you\'re looking for.',
            'landing.step2Title': 'Discover Matches',
            'landing.step2Desc': 'Browse profiles and swipe right on potential roommates.',
            'landing.step3Title': 'Connect',
            'landing.step3Desc': 'Match and chat directly to find your perfect living situation.',

            // Login
            'login.title': 'Welcome Back',
            'login.subtitle': 'Sign in to continue',
            'login.email': 'Email',
            'login.emailPlaceholder': 'Enter your email',
            'login.password': 'Password',
            'login.passwordPlaceholder': 'Enter your password',
            'login.submit': 'Sign In',
            'login.loggingIn': 'Signing in...',
            'login.error': 'Login failed. User not found or wrong password.',
            'login.noAccount': 'Don\'t have an account?',
            'login.register': 'Register here',

            // Register
            'register.title': 'Create Account',
            'register.subtitle': 'Join RoomieMatch today',
            'register.firstName': 'First Name',
            'register.lastName': 'Last Name',
            'register.email': 'Email',
            'register.password': 'Password',
            'register.age': 'Age',
            'register.gender': 'Gender',
            'register.male': 'Male',
            'register.female': 'Female',
            'register.other': 'Other',
            'register.userType': 'I am...',
            'register.hasRoom': 'Looking for a roommate (I have a room)',
            'register.needsRoom': 'Looking for a room',
            'register.bio': 'About me',
            'register.submit': 'Create Account',
            'register.hasAccount': 'Already have an account?',
            'register.login': 'Login here',

            // Dashboard
            'dashboard.welcome': 'Welcome back',
            'dashboard.subtitle': 'Ready to find your perfect roommate? Here\'s your overview.',
            'dashboard.goodMorning': 'Good morning',
            'dashboard.goodAfternoon': 'Good afternoon',
            'dashboard.goodEvening': 'Good evening',
            'dashboard.profileCompletion': 'Profile Completion',
            'dashboard.totalMatches': 'Total Matches',
            'dashboard.newToday': 'New Today',
            'dashboard.unreadMessages': 'Unread Messages',
            'dashboard.profileComplete': 'Profile Complete',
            'dashboard.quickActions': 'Quick Actions',
            'dashboard.findRoommates': 'Find Roommates',
            'dashboard.findRoommatesDesc': 'Browse and swipe on potential matches',
            'dashboard.viewMatches': 'View Matches',
            'dashboard.viewMatchesDesc': 'See all your mutual connections',
            'dashboard.editProfile': 'Edit Profile',
            'dashboard.editProfileDesc': 'Update your details and photos',
            'dashboard.recentMatches': 'Recent Matches',
            'dashboard.seeAll': 'See all',
            'dashboard.noMatches': 'No matches yet',
            'dashboard.startSwiping': 'Start swiping to find your perfect roommate!',
            'dashboard.startExploring': 'Start Exploring',
            'dashboard.completeProfile': 'Complete Your Profile',
            'dashboard.profileReminder': 'Profiles with photos get 10x more matches! Your profile is',
            'dashboard.complete': 'complete',
            'dashboard.completeNow': 'Complete Now',

            // Explore
            'explore.title': 'Discover',
            'explore.subtitle': 'Swipe right to like, left to pass',
            'explore.loading': 'Loading potential roomies...',
            'explore.noMore': 'No more profiles to show',
            'explore.checkBack': 'Check back later for new potential roommates!',
            'explore.tapDetails': 'Tap card for details',

            // Profile
            'profile.title': 'My Profile',
            'profile.subtitle': 'Manage your details and preferences',
            'profile.profileCompletion': 'Profile Completion',
            'profile.missing': 'Missing',
            'profile.complete': 'Your profile is complete!',
            'profile.personalInfo': 'Personal Information',
            'profile.profileImage': 'Profile Image',
            'profile.uploading': 'Uploading...',
            'profile.uploadHint': 'Upload a real photo (max 10MB)',
            'profile.firstName': 'First Name',
            'profile.lastName': 'Last Name',
            'profile.age': 'Age',
            'profile.gender': 'Gender',
            'profile.bio': 'Bio',
            'profile.iAm': 'I am...',
            'profile.lookingForRoom': 'Looking for a Room',
            'profile.offeringRoom': 'Offering a Room',
            'profile.roomDetails': 'Room Details',
            'profile.roomDetailsDesc': 'Describe the room you are offering',
            'profile.roomTitle': 'Title',
            'profile.roomTitlePlaceholder': 'e.g. Cozy Room in Nørrebro',
            'profile.roomPhotos': 'Room Photos (up to 5)',
            'profile.addPhoto': 'Add Photo',
            'profile.rent': 'Rent (Monthly)',
            'profile.size': 'Size (m²)',
            'profile.location': 'Location',
            'profile.description': 'Description',
            'profile.availableFrom': 'Available From',
            'profile.roommatePreferences': 'Roommate Preferences',
            'profile.roomPreferences': 'Room Preferences',
            'profile.roommatePreferencesDesc': 'What kind of roommate are you looking for?',
            'profile.roomPreferencesDesc': 'What kind of room and renter are you looking for?',
            'profile.maxBudget': 'Maximum Budget ($)',
            'profile.preferredLocation': 'Preferred Location',
            'profile.preferredGenderOwner': 'Preferred Gender of Room Owner',
            'profile.preferredGender': 'Preferred Roommate Gender',
            'profile.any': 'Any',
            'profile.minAge': 'Min Roommate Age',
            'profile.maxAge': 'Max Roommate Age',
            'profile.save': 'Save Changes',
            'profile.saving': 'Saving...',

            // Matches
            'matches.title': 'Your Matches',
            'matches.pleaseLogin': 'Please log in to see your matches.',
            'matches.noMatches': 'No matches yet. Keep swiping!',
            'matches.startExploring': 'Start exploring to find your perfect roommate!',
            'matches.chat': 'Chat',
            'matches.viewProfile': 'View Profile',

            // Swipe Card
            'card.hasRoom': 'Has Room',
            'card.needsRoom': 'Needs Room',
            'card.noBio': 'No bio provided.',
            'card.noDescription': 'No description provided.',
            'card.aboutRoom': 'About the Room',
            'card.aboutRenter': 'About the Renter',
            'card.aboutMe': 'About Me',
            'card.lookingFor': 'What I\'m Looking For',
            'card.pass': 'Pass',
            'card.like': 'Like',

            // Footer
            'footer.information': 'Information',
            'footer.navigation': 'Navigation',
            'footer.followUs': 'Follow Us',
            'footer.home': 'Home',
            'footer.searchRoom': 'Search Room',
            'footer.searchRoommate': 'Search Roommate',
            'footer.aboutUs': 'About Us',
            'footer.howItWorks': 'How It Works',
            'footer.terms': 'Terms of Service',
            'footer.privacy': 'Privacy Policy',
            'footer.cookies': 'Cookies',
            'footer.contact': 'Contact',
            'footer.faq': 'FAQ',
            'footer.tagline': 'Denmark\'s platform for finding the perfect roommate.',
            'footer.copyright': '© 2026 RoomieMatch ApS. All rights reserved.',

            // Common
            'common.loading': 'Loading...',
            'common.error': 'An error occurred',
            'common.retry': 'Try again',
            'common.cancel': 'Cancel',
            'common.confirm': 'Confirm',
            'common.close': 'Close',
        },
        da: {
            // Navbar
            'nav.dashboard': 'Oversigt',
            'nav.explore': 'Udforsk',
            'nav.matches': 'Matches',
            'nav.profile': 'Profil',
            'nav.login': 'Log ind',
            'nav.register': 'Opret konto',
            'nav.logout': 'Log ud',

            // Landing Page
            'landing.title': 'Find Din Perfekte',
            'landing.titleHighlight': 'Roommate',
            'landing.description': 'RoomieMatch forbinder folk der søger værelser med dem der har værelser til leje. Smart matching, verificerede profiler og en problemfri oplevelse.',
            'landing.cta': 'Kom i gang nu - det er gratis',
            'landing.feature1': 'Verificerede profiler',
            'landing.feature2': 'Smart matching',
            'landing.feature3': 'Indbygget chat',
            'landing.stat1': 'Aktive opslag',
            'landing.stat2': 'Nye opslag / uge',
            'landing.stat3': 'Succesfulde matches',
            'landing.howTitle': 'Sådan Virker Det',
            'landing.howSubtitle': 'Find din næste roommate i tre nemme trin',
            'landing.step1Title': 'Opret Profil',
            'landing.step1Desc': 'Tilmeld dig og fortæl os om dig selv og hvad du søger.',
            'landing.step2Title': 'Find Matches',
            'landing.step2Desc': 'Gennemse profiler og swipe til højre på potentielle roommates.',
            'landing.step3Title': 'Forbind',
            'landing.step3Desc': 'Match og chat direkte for at finde din perfekte boligsituation.',

            // Login
            'login.title': 'Velkommen Tilbage',
            'login.subtitle': 'Log ind for at fortsætte',
            'login.email': 'Email',
            'login.emailPlaceholder': 'Indtast din email',
            'login.password': 'Adgangskode',
            'login.passwordPlaceholder': 'Indtast din adgangskode',
            'login.submit': 'Log Ind',
            'login.loggingIn': 'Logger ind...',
            'login.error': 'Login mislykkedes. Bruger ikke fundet eller forkert adgangskode.',
            'login.noAccount': 'Har du ikke en konto?',
            'login.register': 'Opret her',

            // Register
            'register.title': 'Opret Konto',
            'register.subtitle': 'Bliv en del af RoomieMatch',
            'register.firstName': 'Fornavn',
            'register.lastName': 'Efternavn',
            'register.email': 'Email',
            'register.password': 'Adgangskode',
            'register.age': 'Alder',
            'register.gender': 'Køn',
            'register.male': 'Mand',
            'register.female': 'Kvinde',
            'register.other': 'Andet',
            'register.userType': 'Jeg er...',
            'register.hasRoom': 'Søger roommate (jeg har et værelse)',
            'register.needsRoom': 'Søger et værelse',
            'register.bio': 'Om mig',
            'register.submit': 'Opret Konto',
            'register.hasAccount': 'Har du allerede en konto?',
            'register.login': 'Log ind her',

            // Dashboard
            'dashboard.welcome': 'Velkommen tilbage',
            'dashboard.subtitle': 'Klar til at finde din perfekte roommate? Her er din oversigt.',
            'dashboard.goodMorning': 'Godmorgen',
            'dashboard.goodAfternoon': 'God eftermiddag',
            'dashboard.goodEvening': 'Godaften',
            'dashboard.profileCompletion': 'Profil Fuldførelse',
            'dashboard.totalMatches': 'Matches i Alt',
            'dashboard.newToday': 'Nye i Dag',
            'dashboard.unreadMessages': 'Ulæste Beskeder',
            'dashboard.profileComplete': 'Profil Fuldført',
            'dashboard.quickActions': 'Hurtige Handlinger',
            'dashboard.findRoommates': 'Find Roommates',
            'dashboard.findRoommatesDesc': 'Gennemse og swipe på potentielle matches',
            'dashboard.viewMatches': 'Se Matches',
            'dashboard.viewMatchesDesc': 'Se alle dine matches',
            'dashboard.editProfile': 'Rediger Profil',
            'dashboard.editProfileDesc': 'Opdater dine oplysninger og billeder',
            'dashboard.recentMatches': 'Seneste Matches',
            'dashboard.seeAll': 'Se alle',
            'dashboard.noMatches': 'Ingen matches endnu',
            'dashboard.startSwiping': 'Begynd at swipe for at finde din perfekte roommate!',
            'dashboard.startExploring': 'Start Udforskning',
            'dashboard.completeProfile': 'Færdiggør Din Profil',
            'dashboard.profileReminder': 'Profiler med billeder får 10x flere matches! Din profil er',
            'dashboard.complete': 'færdig',
            'dashboard.completeNow': 'Færdiggør Nu',

            // Explore
            'explore.title': 'Udforsk',
            'explore.subtitle': 'Swipe til højre for at like, venstre for at passe',
            'explore.loading': 'Indlæser potentielle roomies...',
            'explore.noMore': 'Ingen flere profiler at vise',
            'explore.checkBack': 'Kom tilbage senere for nye potentielle roommates!',
            'explore.tapDetails': 'Tryk på kort for detaljer',

            // Profile
            'profile.title': 'Min Profil',
            'profile.subtitle': 'Administrer dine oplysninger og præferencer',
            'profile.profileCompletion': 'Profil Fuldførelse',
            'profile.missing': 'Mangler',
            'profile.complete': 'Din profil er komplet!',
            'profile.personalInfo': 'Personlige Oplysninger',
            'profile.profileImage': 'Profilbillede',
            'profile.uploading': 'Uploader...',
            'profile.uploadHint': 'Upload et rigtigt foto (max 10MB)',
            'profile.firstName': 'Fornavn',
            'profile.lastName': 'Efternavn',
            'profile.age': 'Alder',
            'profile.gender': 'Køn',
            'profile.bio': 'Bio',
            'profile.iAm': 'Jeg er...',
            'profile.lookingForRoom': 'Søger et Værelse',
            'profile.offeringRoom': 'Tilbyder et Værelse',
            'profile.roomDetails': 'Værelse Detaljer',
            'profile.roomDetailsDesc': 'Beskriv værelset du tilbyder',
            'profile.roomTitle': 'Titel',
            'profile.roomTitlePlaceholder': 'f.eks. Hyggeligt værelse på Nørrebro',
            'profile.roomPhotos': 'Værelse Billeder (op til 5)',
            'profile.addPhoto': 'Tilføj Billede',
            'profile.rent': 'Leje (Månedlig)',
            'profile.size': 'Størrelse (m²)',
            'profile.location': 'Placering',
            'profile.description': 'Beskrivelse',
            'profile.availableFrom': 'Ledig Fra',
            'profile.roommatePreferences': 'Roommate Præferencer',
            'profile.roomPreferences': 'Værelse Præferencer',
            'profile.roommatePreferencesDesc': 'Hvilken slags roommate leder du efter?',
            'profile.roomPreferencesDesc': 'Hvilken slags værelse og udlejer leder du efter?',
            'profile.maxBudget': 'Maksimalt Budget (kr)',
            'profile.preferredLocation': 'Foretrukket Placering',
            'profile.preferredGenderOwner': 'Foretrukket Køn på Udlejer',
            'profile.preferredGender': 'Foretrukket Roommate Køn',
            'profile.any': 'Alle',
            'profile.minAge': 'Min Roommate Alder',
            'profile.maxAge': 'Max Roommate Alder',
            'profile.save': 'Gem Ændringer',
            'profile.saving': 'Gemmer...',

            // Matches
            'matches.title': 'Dine Matches',
            'matches.pleaseLogin': 'Log ind for at se dine matches.',
            'matches.noMatches': 'Ingen matches endnu. Bliv ved med at swipe!',
            'matches.startExploring': 'Begynd at udforske for at finde din perfekte roommate!',
            'matches.chat': 'Chat',
            'matches.viewProfile': 'Se Profil',

            // Swipe Card
            'card.hasRoom': 'Har Værelse',
            'card.needsRoom': 'Søger Værelse',
            'card.noBio': 'Ingen bio angivet.',
            'card.noDescription': 'Ingen beskrivelse angivet.',
            'card.aboutRoom': 'Om Værelset',
            'card.aboutRenter': 'Om Udlejeren',
            'card.aboutMe': 'Om Mig',
            'card.lookingFor': 'Hvad Jeg Søger',
            'card.pass': 'Nej tak',
            'card.like': 'Like',

            // Footer
            'footer.information': 'Information',
            'footer.navigation': 'Navigation',
            'footer.followUs': 'Følg os',
            'footer.home': 'Forside',
            'footer.searchRoom': 'Søg bolig',
            'footer.searchRoommate': 'Søg roommate',
            'footer.aboutUs': 'Om Os',
            'footer.howItWorks': 'Sådan Virker Det',
            'footer.terms': 'Brugerbetingelser',
            'footer.privacy': 'Privatlivspolitik',
            'footer.cookies': 'Cookies',
            'footer.contact': 'Kontakt',
            'footer.faq': 'Råd og svar',
            'footer.tagline': 'Danmarks platform til at finde den perfekte roommate.',
            'footer.copyright': '© 2026 RoomieMatch ApS. Alle rettigheder forbeholdes.',

            // Common
            'common.loading': 'Indlæser...',
            'common.error': 'Der opstod en fejl',
            'common.retry': 'Prøv igen',
            'common.cancel': 'Annuller',
            'common.confirm': 'Bekræft',
            'common.close': 'Luk',
        }
    };

    private getStoredLanguage(): Language {
        const stored = localStorage.getItem('language');
        return (stored === 'da' || stored === 'en') ? stored : 'da'; // Default to Danish
    }

    get language(): Language {
        return this.currentLang.value;
    }

    setLanguage(lang: Language) {
        this.currentLang.next(lang);
        localStorage.setItem('language', lang);
    }

    toggleLanguage() {
        const newLang = this.currentLang.value === 'en' ? 'da' : 'en';
        this.setLanguage(newLang);
    }

    t(key: string): string {
        return this.translations[this.currentLang.value][key] || key;
    }

    // For reactive templates
    translate(key: string): string {
        return this.t(key);
    }
}
