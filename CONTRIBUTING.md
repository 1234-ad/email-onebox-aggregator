# Contributing to Email Onebox Aggregator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/email-onebox-aggregator.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

Follow the [Setup Guide](docs/SETUP.md) to set up your development environment.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic

### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props

### Backend
- Follow service-oriented architecture
- Keep controllers thin
- Put business logic in services
- Handle errors properly

## Testing

Before submitting a PR:

1. Test all API endpoints with Postman
2. Test the frontend UI thoroughly
3. Verify IMAP connections work
4. Check Elasticsearch indexing
5. Test AI categorization
6. Verify webhook triggers

## Pull Request Guidelines

### PR Title
Use conventional commits format:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `refactor: Refactor code`
- `test: Add tests`

### PR Description
Include:
- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots (for UI changes)
- Related issues

### Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Backward compatible

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)

## Bug Reports

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs

## Areas for Contribution

### High Priority
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Improve error handling
- [ ] Add authentication
- [ ] Performance optimizations

### Features
- [ ] Email sending capability
- [ ] Advanced search filters
- [ ] Email templates
- [ ] Analytics dashboard
- [ ] Mobile responsive improvements

### Documentation
- [ ] Video tutorials
- [ ] More examples
- [ ] Deployment guides
- [ ] Troubleshooting guides

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Your contribution will be credited

## Community

- Be respectful and inclusive
- Help others in issues/discussions
- Share your use cases
- Provide constructive feedback

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🎉
