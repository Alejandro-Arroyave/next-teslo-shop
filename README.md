This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

Teslo shop, it's intended to be a clone of tesla clothes shop web with some little changes.

Project made with [this](https://udemy.com/course/nextjs-fh) Next Course by Fernando Herrera.

## Run in dev

- Install all dependencies in the project:

  ```bash
  npm install
  ```

- Create a copy of `.env.template`, rename to `.env` and set environment variables

- Set up database:

  ```bash
  docker-compose up -d
  ```

- Run prisma migrations:

  ```bash
  npx prisma migrate dev
  ```

- Execute seed

  ```bash
  npm run seed
  ```

- Run the development server:

  ```bash
  npm run dev
  ```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Run in prod

## Technologies

This application uses the following technologies:

- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Swiper](https://swiperjs.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
