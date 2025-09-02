# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Changed

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
