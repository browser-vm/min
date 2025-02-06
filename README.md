# Min: Ultraviolet Web Proxy Unblocker

## Overview

Min is a lightweight, secure web proxy unblocker designed to provide seamless, private internet browsing with minimal complexity. Built using the Ultraviolet proxy framework, Min offers users a clean, intuitive interface for accessing restricted web content.

## 🚀 Features

- **Simple Interface**: One-click URL unblocking
- **Advanced Privacy**: URL encryption and anonymization
- **Cross-Platform Compatibility**: Works on multiple devices and browsers
- **Lightweight Design**: Minimal resource consumption
- **Secure Routing**: Advanced proxy techniques to bypass restrictions

## Prerequisites

- Node.js (v14.0+ recommended)
- npm (Node Package Manager)
- Docker (optional, for containerized deployment)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/browser-vm/min.git
cd min
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

### Docker Deployment (do not use, in development)

1. Build the Docker image:
```bash
docker build -t min-proxy .
```

2. Run the container:
```bash
docker run -p 8080:8080 min-proxy
```

## Configuration

Customize your proxy settings in `uv.config.js`:
- Modify URL encoding methods
- Adjust proxy prefixes
- Configure bare server routes

## Security Considerations

- Always use HTTPS in production
- Implement additional authentication if required
- Regularly update dependencies
- Comply with local internet usage laws

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues or questions, please file a GitHub issue or contact browservm@outlook.com.

---

**Disclaimer**: Min is intended for legitimate, legal internet access. Respect website terms of service and local regulations.
