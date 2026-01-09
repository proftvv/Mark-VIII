# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email**: [Create a private security advisory]
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity

## Security Best Practices

### For Users

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Different passwords for login and encryption

2. **Keep Encryption Passwords Safe**
   - Write them down securely
   - Use a password manager
   - Never share with anyone

3. **Update Regularly**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Apply security patches promptly

4. **Use HTTPS in Production**
   - Required for biometric authentication
   - Protects data in transit
   - Deploy with SSL/TLS

### For Developers

1. **Code Security**
   - Never commit secrets
   - Use environment variables
   - Validate all inputs
   - Sanitize outputs

2. **Dependencies**
   - Regular security audits
   - Keep packages updated
   - Review dependency licenses

3. **Database**
   - Use prepared statements
   - Implement access controls
   - Regular backups

## Known Security Considerations

1. **Local Storage**: Data stored locally in SQLite
2. **Client-Side Encryption**: Encryption happens in browser
3. **Session Management**: Uses sessionStorage
4. **Biometric Auth**: Requires HTTPS except localhost

## Disclosure Policy

- Responsible disclosure appreciated
- Credit given to security researchers
- Public disclosure after fix is available
