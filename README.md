# EnderBrary

**EnderBrary** is a full-stack social network for book lovers where users can showcase their personal libraries, borrow books from each other, and track lending and returns seamlessly.

## 🌐 Project Structure

```
EnderBrary/
├── backend/                # Spring Boot application (Gradle)
│   ├── src/
│   ├── build.gradle        # Gradle project config
│   └── ...
└── frontend/               # Next.js 15 frontend
    ├── public/
    ├── app/
    ├── package.json
    └── ...
```

---

## 🚀 Tech Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security + OAuth2 + JWT
* PostgreSQL
* Jakarta Mail

### Frontend

* Next.js 15 (App Router)
* Tailwind CSS
* React Query or SWR (your choice)
* OAuth via Google

---

## ⚙️ Backend Configuration (in `.properties`)

Make sure to configure the following:

* `spring.datasource` properties for database connection
* `spring.mail` for email notifications
* `application.security.jwt` for token-based auth
* `application.mailing.frontend.*` for frontend links in emails

---

## 📦 Running Locally

### Backend

```bash
cd backend
./gradlew bootRun
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Features

* Register/Login with email/password and OAuth2
* Book listing & archiving
* Borrow request & approval workflow
* Email notifications (borrow, return, approval, etc.)
* JWT secured endpoints
* Admin support ready (for future moderation)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.
Whether it’s a bug fix, feature idea, or documentation improvement — we’d love to have your help.

---

## 📬 Contact

For questions, suggestions, or contributions: [Srinjay Dasgupta](https://github.com/SRINJAYDASGUPTA-Git)

---

> "Read. Share. Connect. — With EnderBrary."
