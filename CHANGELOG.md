# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Dashboard Interface**: Complete dashboard page with shadcn UI components
  - Dashboard page with metrics cards showing platform statistics
  - Sidebar navigation with collapsible functionality
  - Recent activity feed with dynamic status badges
  - Quick actions panel for common tasks
  - Analytics overview with tabbed content
  - Responsive design using Tailwind CSS semantic color variables
  - Integration with existing auth context and theme system
- **Authentication System**: Complete 3-method authentication system migrated from frontend-backup
  - Username/Password authentication with deterministic principal generation
  - Internet Identity (ICP) integration with @dfinity/auth-client
  - Google OAuth integration with JWT parsing and principal generation
  - AuthContext and AuthService for state management
  - Secure hash algorithms (SHA-256) with fallback support
  - Principal generation with cryptographic salt
- **S3 Integration**: Full S3 integration system migrated from frontend-backup
  - AWS SDK v3 integration for file uploads
  - File validation (type, size) with configurable limits
  - Custom endpoint support for S3-compatible services
  - Error handling and cleanup mechanisms
  - Metadata tracking for uploaded files
  - Environment-based configuration
  - Connection testing and validation
- **Toast Notification System**: Complete notification system
  - ToastContext for state management
  - Toast and ToastContainer components with proper header spacing
  - Support for success, error, warning, and info types
  - Auto-dismiss with configurable duration
  - Positioned with proper spacing from header (top-20)
- **Login Components**: Complete authentication UI
  - LoginForm component with username/password
  - Login page with 3 authentication options
  - Responsive design with shadcn/ui components
  - Form validation and error handling
- **Type System**: Comprehensive TypeScript types
  - Auth types (User, LoginResult, GoogleUser)
  - S3 types (S3Config, UploadResult, PhysicalArtSession)
  - Proper type exports and organization
- **Service Layer**: Complete service architecture
  - GoogleAuthService for OAuth integration
  - PhysicalArtService for S3 operations
  - AuthService for principal management with backend integration
  - Real backend calls for user registration and login
  - Mock implementations ready for backend integration
- **Provider Integration**: Complete context provider setup
  - AuthProvider for authentication state
  - ToastProvider for notifications with proper positioning
  - ThemeProvider integration maintained
  - Proper provider hierarchy in root layout
- **Documentation**: Comprehensive setup documentation
  - AUTH_S3_SETUP.md with complete implementation guide
  - Environment variables configuration
  - Usage examples and troubleshooting
  - Security features documentation
- **LoginModal Component**: New authentication modal
  - 3 clear login options (ICP, Google, Username)
  - No auto-login - user must choose method
  - Loading states with infinite spinner and error handling
  - Proper color system integration with globals.css
  - Responsive design with shadcn/ui components
- **Enhanced LoginModal**: Modern minimalis design with improved UX
  - **Modern UI**: Clean, minimalis interface with consistent spacing
  - **Enhanced UX**: Loading states with infinite spinner, form validation, password toggle
  - **Backend Integration**: Real backend calls for user registration/login
  - **Toast Feedback**: Clear feedback for all user actions
  - **Form Validation**: Real-time validation for username/password
  - **Logo Integration**: ICP and Google logos from frontend-backup
  - **Smooth Animations**: Infinite loading spinners and hover transitions
- Add modern NFT marketplace landing page with Thunder-inspired design
- Add comprehensive shadcn/ui component library integration (14 components)
- Add backend service integration for real-time marketplace statistics
- Add ICRC-7 NFT standard implementation with full compliance to Internet Computer NFT specification
- Add NFT minting from physical art sessions with rich metadata including artist info and photo URLs
- Add automated S3 configuration setup during deployment
- Add Physical Art Session management for photo uploads
- Add S3 presigned URL generation with AWS Signature V4
- Add automatic S3 credentials management via environment variables
- Add deployment scripts with integrated S3 setup (`npm run deploy:full`)
- Add set_count update method to allow setting the counter to a specific value
- Add frontend development server scripts (`npm run start`)
- Add LLM canister implementation
- Add theme toggle functionality with dark/light theme support
- Add next-themes integration for system theme detection
- Add ThemeProvider wrapper for theme management
- **Spinner System**: Modern loading spinner with multiple variants
  - **Infinite Spinner**: Primary loading state using SVG animation
  - **Multiple Variants**: default, circle, pinwheel, circle-filled, ellipsis, ring, bars, infinite
  - **Size Options**: sm (16px), md (24px), lg (32px) with proper scaling
  - **Integration**: Used across all loading states (forms, authentication, navigation)
  - **Next.js Loading**: Global loading.tsx with infinite spinner for route transitions
- **Toast Context System**: Enhanced notification positioning and spacing
  - **Proper Header Spacing**: Toast positioned at top-20 (80px) for header clearance
  - **Context Management**: ToastContext for centralized notification state
  - **Auto-dismiss**: Configurable duration with smooth animations
  - **Type Support**: Success, error, warning, info with semantic colors

### Changed

- **Authentication Flow**: Fixed auto-login issue
  - **Connect Wallet button no longer auto-logs in** - requires user action
  - **LoginModal displays 3 authentication options** instead of direct login
  - **Middleware protection** - user must explicitly choose login method
  - **Proper authentication flow** matching frontend-backup behavior
- **Color System Integration**: Enhanced with globals.css colors
  - **LoginModal uses semantic color variables** from globals.css
  - **Consistent theming** across all authentication components
  - **Proper contrast and accessibility** with CSS custom properties
  - **Dark/light theme support** maintained
- **Navigation Header**: Updated authentication handling
  - **Connect Wallet opens LoginModal** instead of direct login
  - **User state properly managed** through AuthContext
  - **Logout functionality** integrated
  - **User dropdown menu** shows after authentication
  - **Loading states** use infinite spinner for better UX
- **Package Dependencies**: Added comprehensive auth and S3 dependencies
  - @aws-sdk/client-s3 for S3 operations
  - @dfinity/auth-client and @dfinity/principal for ICP integration
  - crypto-js and types for secure operations
  - i18next and react-i18next for internationalization
- **File Structure**: Organized components and services
  - Auth components in dedicated directory
  - Service layer with proper separation
  - Type definitions with clear organization
  - Context providers with proper hierarchy
- **Root Layout**: Enhanced with authentication and notification providers
  - AuthProvider for user authentication
  - ToastProvider for notifications with proper header spacing
  - ToastContainer for display with top-20 positioning
  - Maintained theme provider integration
- Modernize frontend architecture with Next.js 15 and Tailwind CSS v4
- Update color theme to use semantic CSS custom properties for consistency
- Remove search and language toggle from navigation header
- Replace search and language toggle with theme toggle button
- Update navigation header to use theme toggle instead of search and language selector
- Set default theme to light mode for better user experience

## [0.1.0] - 2025-04-24

### Added

- Basic canister structure with Rust
- Counter functionality with increment and get_count methods
- Greeting functionality
- PocketIC testing infrastructure
- Vitest test runner configuration
- GitHub CI workflow for automated end-to-end tests for all methods
- Project documentation
- Add custom instructions for github copilot
