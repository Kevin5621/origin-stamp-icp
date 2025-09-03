# Dokumentasi Komponen Shadcn UI yang Terinstall

## Daftar Komponen yang Sudah Didownload dan Digunakan

### 1. **Button** (`src/components/ui/button.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen tombol dengan berbagai varian dan ukuran
- **Digunakan di**: NavigationHeader, HeroSection, FeaturesSection, Footer, CreatorsSection
- **Varian**: default, destructive, outline, secondary, ghost, link
- **Ukuran**: default, sm, lg, icon
- **Theme Integration**: Menggunakan `--color-primary`, `--color-secondary` dari globals.css

### 2. **Card** (`src/components/ui/card.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen kartu untuk menampilkan konten dalam container
- **Digunakan di**: CreatorsSection, FeaturesSection, HeroSection
- **Includes**: Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
- **Theme Integration**: Menggunakan `--color-card`, `--color-border`

### 3. **Badge** (`src/components/ui/badge.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen label/tag kecil untuk status atau kategori
- **Digunakan di**: HeroSection (Verified, Certified), CreatorsSection (subscription status)
- **Varian**: default, secondary, destructive, outline
- **Theme Integration**: Menggunakan `--color-primary`, `--color-destructive`

### 4. **Avatar** (`src/components/ui/avatar.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen untuk menampilkan foto profil user/creator
- **Digunakan di**: NavigationHeader (user menu), CreatorsSection (creator profiles)
- **Includes**: Avatar, AvatarFallback, AvatarImage
- **Theme Integration**: Menggunakan gradient dari `--color-primary` ke `--color-accent`

### 5. **Input** (`src/components/ui/input.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen input form untuk text, email, dll
- **Digunakan di**: Footer (newsletter subscription)
- **Theme Integration**: Menggunakan `--color-card`, `--color-border`, `--color-foreground`

### 6. **Dropdown Menu** (`src/components/ui/dropdown-menu.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Menu dropdown untuk navigasi atau aksi user
- **Digunakan di**: NavigationHeader (user menu saat sudah connect wallet)
- **Includes**: DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
- **Theme Integration**: Menggunakan `--color-popover`, `--color-accent`

### 7. **Navigation Menu** (`src/components/ui/navigation-menu.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen navigasi utama dengan submenu
- **Digunakan di**: NavigationHeader (desktop navigation)
- **Includes**: NavigationMenu, NavigationMenuItem, NavigationMenuList
- **Theme Integration**: Menggunakan `--color-muted-foreground`, `--color-foreground`

### 8. **Separator** (`src/components/ui/separator.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Garis pemisah horizontal/vertikal
- **Digunakan di**: Footer (section dividers)
- **Theme Integration**: Menggunakan `--color-border`

### 9. **Sheet** (`src/components/ui/sheet.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Slide-out panel dari samping layar
- **Digunakan di**: NavigationHeader (mobile menu)
- **Includes**: Sheet, SheetContent, SheetTrigger
- **Theme Integration**: Menggunakan `--color-popover`, `--color-border`

### 11. **Tabs** (`src/components/ui/tabs.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen tab untuk switching konten
- **Digunakan di**: DashboardPage (Analytics Overview section)
- **Includes**: Tabs, TabsContent, TabsList, TabsTrigger
- **Theme Integration**: Menggunakan `--color-muted`, `--color-accent`

### 11. **Dialog** (`src/components/ui/dialog.tsx`) ⏳ BELUM DIGUNAKAN

- **Fungsi**: Modal dialog untuk konten popup
- **Status**: Terinstall tapi belum digunakan
- **Includes**: Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
- **Potential Use**: Untuk NFT detail modal, wallet connection modal

### 12. **Tooltip** (`src/components/ui/tooltip.tsx`) ⏳ BELUM DIGUNAKAN

- **Fungsi**: Popup informasi saat hover
- **Status**: Terinstall tapi belum digunakan
- **Includes**: Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
- **Potential Use**: Untuk informasi creator stats, NFT details

### 13. **Hover Card** (`src/components/ui/hover-card.tsx`) ⏳ BELUM DIGUNAKAN

- **Fungsi**: Card popup yang muncul saat hover
- **Status**: Terinstall tapi belum digunakan
- **Includes**: HoverCard, HoverCardContent, HoverCardTrigger
- **Potential Use**: Untuk preview creator profile saat hover

### 14. **Aspect Ratio** (`src/components/ui/aspect-ratio.tsx`) ⏳ BELUM DIGUNAKAN

- **Fungsi**: Wrapper untuk mempertahankan aspect ratio elemen
- **Status**: Terinstall tapi belum digunakan
- **Potential Use**: Untuk konsisten aspect ratio NFT images

### 15. **Theme Toggle** (`src/components/ui/theme-toggle.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen toggle untuk switch antara dark dan light theme
- **Digunakan di**: NavigationHeader (menggantikan search dan language toggle)
- **Features**: Sun/Moon icon dengan smooth transition, light theme default
- **Theme Integration**: Menggunakan next-themes dengan CSS custom properties
- **Accessibility**: Screen reader support dengan sr-only text
- **Default Theme**: Light theme sebagai default untuk user experience yang lebih baik

### 16. **Spinner** (`src/components/ui/spinner.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen loading spinner dengan berbagai variant animasi
- **Digunakan di**: LoadingSpinner, DashboardGuard, LoginForm, LoginModal, loading.tsx
- **Variant**: default, circle, pinwheel, circle-filled, ellipsis, ring, bars, infinite
- **Size**: sm (16px), md (24px), lg (32px) dengan proper scaling
- **Primary Variant**: infinite (SVG path animation) untuk loading state utama
- **Integration**: Menggantikan semua Loader2 dan loading spinner lama
- **Next.js Loading**: Global loading.tsx menggunakan infinite spinner

### 17. **LoadingSpinner** (`src/components/ui/loading-spinner.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Wrapper komponen untuk LoadingSpinner dengan size mapping
- **Digunakan di**: DashboardGuard, loading.tsx global
- **Size Mapping**: sm→16px, md→24px, lg→32px
- **Default Variant**: infinite sebagai primary loading state
- **Legacy Support**: Kompatibel dengan komponen lama yang menggunakan size classes

### 18. **Toast** (`src/components/ui/toast.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen notifikasi toast dengan berbagai tipe
- **Digunakan di**: ToastContainer untuk semua notifikasi aplikasi
- **Types**: success, error, warning, info dengan semantic colors
- **Features**: Auto-dismiss, smooth animations, responsive design
- **Theme Integration**: Menggunakan semantic color variables dari globals.css

### 20. **Sidebar** (`src/components/ui/sidebar.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen sidebar navigasi dengan layout modern dan responsive
- **Digunakan di**: DashboardSidebar untuk navigasi utama dashboard
- **Includes**: Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarProvider, SidebarInset
- **Features**: Collapsible navigation, grouped menu items, active state management
- **Theme Integration**: Menggunakan semantic color variables dari globals.css
- **Responsive**: Built-in mobile responsiveness dengan use-mobile hook

### 21. **Switch** (`src/components/ui/switch.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Komponen toggle switch untuk pengaturan boolean
- **Digunakan di**: SettingsPage untuk berbagai pengaturan user
- **Features**: Controlled/uncontrolled modes, accessibility support
- **Theme Integration**: Menggunakan `--color-primary`, `--color-muted`
- **Accessibility**: ARIA labels dan keyboard navigation support

### 22. **Skeleton** (`src/components/ui/skeleton.tsx`) ✅ TERINSTALL

- **Fungsi**: Loading placeholder dengan animasi shimmer
- **Status**: Terinstall otomatis dengan sidebar component
- **Potential Use**: Loading states untuk dashboard content, user profiles
- **Animation**: Built-in pulse animation untuk loading feedback

## Theme Integration & Best Practices

### CSS Custom Properties Digunakan:

```css
/* Primary Colors */
--color-background: Base background color --color-foreground: Primary text color
  --color-primary: Primary accent color --color-secondary: Secondary accent
  color /* Content Areas */ --color-card: Card background
  --color-popover: Popup/dropdown backgrounds --color-muted: Muted backgrounds
  --color-accent: Interactive accents /* Text */
  --color-muted-foreground: Secondary text --color-primary-foreground: Text on
  primary backgrounds /* Borders & Interactions */ --color-border: Border colors
  --color-destructive: Error/warning states;
```

### Perubahan dari Hardcoded ke Theme:

- ❌ `bg-black` → ✅ `bg-background`
- ❌ `text-white` → ✅ `text-foreground`
- ❌ `text-gray-300` → ✅ `text-muted-foreground`
- ❌ `bg-purple-600` → ✅ `bg-primary`
- ❌ `border-gray-700` → ✅ `border-border`

### Backend Integration:

- **BackendService**: Service layer untuk berkomunikasi dengan Rust backend
- **Real-time Data**: Marketplace stats dari blockchain (certificates, users, sessions)
- **Creator Stats**: Data langsung dari backend dengan fallback ke mock data
- **Type Safety**: Full TypeScript interfaces untuk semua data backend

## Context Providers & State Management

### **ToastContext** (`src/contexts/ToastContext.tsx`) ✅ DIGUNAKAN

- **Fungsi**: Centralized state management untuk toast notifications
- **Features**: Add, remove, auto-dismiss toast dengan configurable duration
- **Toast Types**: success, error, warning, info dengan semantic styling
- **Auto-dismiss**: Default 5 detik dengan manual dismiss option
- **Integration**: Digunakan di semua komponen yang membutuhkan feedback user

### **AuthContext** (`src/contexts/AuthContext.tsx`) ✅ DIGUNAKAN

- **Fungsi**: State management untuk user authentication
- **Features**: Login/logout, user state, loading states
- **Loading Integration**: Menggunakan infinite spinner untuk semua loading states
- **Toast Integration**: Feedback untuk semua auth actions melalui ToastContext

## File Structure:

```
src/components/
├── ui/                    # Shadcn UI components
├── navigation/           # Navigation components
├── sections/            # Page sections (Hero, Creators, Features)
├── layout/             # Layout components (Footer)
└── index.ts           # Component exports

src/contexts/           # Context providers
├── AuthContext.tsx     # Authentication state management
└── ToastContext.tsx    # Toast notification management

src/providers/
└── theme-provider.tsx   # Theme management provider

src/services/
└── backendService.ts  # Backend communication service

src/types/
└── nft.ts            # TypeScript interfaces
```

## Style Configuration (components.json):

- **Style**: new-york (clean, modern)
- **Base Color**: stone (neutral, professional)
- **CSS Variables**: true (semantic theming)
- **Icon Library**: lucide-react (consistent icons)
- **RSC**: true (React Server Components support)
