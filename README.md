# Exit Polling [Front-end] app
This app was presented as a PoC material, to convince teams to switch to Elixir (a functional, concurrent, high-level general-purpose programming language for creating low-latency, distributed, and fault-tolerant systems) and Phoenix framework.

## For whom is this project ?
This can be used by anyone wanting to know more about Elixir/Phoenix, React latest features or showcase Elixir/Phoenix capabilities to convince their own teams 😉.

## About the project
This project is a Full-stack app, where users can perform **real-time** election day exit polling and displaying the result in **real-time**. This repo represents the front-end part of the app.

### Features
- Before election day, an admin user can:
  1. add and maintain districts that they intend on conducting exit polling in.

  ![District-management](<./screenshots/demo/district management screen.png> "District management")

  2. add and maintain the questions; related to specific district; they want to ask voters.

  ![Question-management](<./screenshots/demo/question management screen.png> "Question management")

  3. add and maintain the possible choices they want voters to choose from when performing a vote to a question specific to a ditrict.

  ![Choice-management](<./screenshots/demo/choice management screen.png> "Choice management")

- On election day:
  - logged users dispatched across various polling stations:
    1. open the app and sign-in using an already created account.
    2. choose the corresponding district.
    
    ![poll-districts](<./screenshots/demo/poll districts screen.png> "District selection to start a poll")

    3. when a voter is presented to the station, who's willing to participate in the Exit poll for that district:
        - they click on start poll for that district.
        
        ![start-poll-screen](<./screenshots/demo/invitation to start a poll for a district screen.png> "Invitation to start a poll")

        - all questions related to that district are presented one after the other, along with their corresponding choices.
        - they can vote by picking a choice among choices of the currently presented question.

        ![district-poll](<./screenshots/demo/poll screen.png> "District poll")

  - any user of the app can:
    1. open Poll results of a district
      
      ![poll-results-districts](<./screenshots/demo/poll results districts screen.png> "District selection for poll results")

    2. get votes count of question' choices related to the choosen district in **real-time**
      
      ![poll-results](<./screenshots/demo/poll results screen.png> "Poll results")

## About this part (Front-end part)
This Front-end app uses the latest features of React and Next.js framework (Client/Server components, Server actions, Middleware, App router, ...) to develop UI screens, UI logic(Components composition, Rendering - SSR, ISR, CSR, DR, Streaming - Routing, Fetching data, Caching data, Revalidating data, State management, Protecting pages).

### Project file structure:
![Project-file-structure](<./screenshots/project file structure.png> "Project file structure")

### Rendering & Data fetching strategies/patterns:
The app uses different Server-side rendering strategies:
  1. State-Site Generation / Automatic Static Optimization: districts, questions and choices resources are fetched at build time and cached on Next.js server, so pages requiring those resources are instantly streamed to the end-user from multiple CDN locations.
  2. Incremental Static Regeration: districts, questions, choices and users resources are updated and re-cached after building the app, by using On-demand revalidation within Server actions, and by using Time-based revalidation as well:
      - after each day, the above resources are automatically revalidated.
      - after each 10 minutes, user' resources is automatically revalidated.

      -[Reminder] Time-based revalidation in Next.js acts the same way as "stale-while-revalidate" pattern.

  3. Dynamic Rendering: the root layout route segment (/layout.tsx) is dynamically rendered; rendered at request time; cause it uses a dynamic function that rely on information that can only be known at request time, such as: accessing JWT(JSON Web Token) cookie, to validate user, and get his roles to be able to construct a Nav bar with valid links for the authenticated user.

  4. Streaming: some chunks in different route pages are streamed to the client as it becomes ready. For example, the Poller chunck is streamed to the client, once the questions with their corresponding choices are fetched and loaded  
  ![streaming-chunks-of-route-pages](<./screenshots/streaming chunks of route pages.png> "Streaming chunks of route pages")
  
Server components are used heavily in this project, to be able to run, render, and optionally cache some component data on Node/Edge server environment. Furthermore, They're allowing us to:
  - perform data fetching closer to the data source, thus reducing TTFB(Time To First Byte).

  - keep sensitive data and logic on the server, e.g. JWT and cookies management.

  - reduce client bundle size.

  - split the rendering work into chunks and stream them to the client as they become ready.

Client components are used as well in parts where interaction is paramount. For example, forms, **Poller**, and **PollResults** are client components.
  - the **Poller** component uses state, callbacks, and "voteChoiceAction" server action.
  - the **PollResults** component uses state, and "usePollResultsChannel" custom hook/effect as well, to connect to Elixir channel process with same district id as the selected poll district.

### Connecting to the server(Elixir Channel processes) via websockets:
The app uses "phoenix" npm package; the official phoenix JavaScript client; to connect to Elixir channels via websocket protocol. On server-side, a channel process is created per district, per client. The connection is needed on "PollResults" component, to be able to display choices votes of different questions, related to the selected district in real-time. The mentioned component uses "usePollResultsChannel" custom hook where the lib usage is well encapsulated. Leveraging the use of a custom hook in this situation, allows us to precisely communicate our intent and make the data flow from the effect very explicit for future Dev maintainers.

For a better User experience (UX), the custom hook explicitly reflects the state of the channel connection to the app (via a state prop) and thus to the user (look at image below). The custom hook makes the app goes from "Syncing channel connection" state to "Channel connection established" and vice-versa depending on the socket connection state.


![channel-connection-status-change](<./screenshots/showcase of channel connection status change.png> "Showcase of channel connection status change")




### Authentication & Authorization:
The app provides a sign-in page. Once a user is authenticated, a cookie is created containing the JWT token, generated by the Elixir/Phoenix back-end app. The root layout wraps its children in "AuthProvider" server component, which is responsible for:  
  - validating JWT access token located in a cookie, by using "jose" npm package.
  - extracting JWT payload from it.
  - passing JWT payload to "CurrentUserProvider" memoized client component, which fetches the corresponding user, and provides it within a React context to any child component underneath.

Middlewares are used to prohibit unauthenticated users to access protected resources. The NavBar component settled in root layout, uses "CurrentUserContext" to get access to the current authenticated user, and depending on its role, it provides links accordingly:
  - Logged users not having "Admin" role, can participate in Exit poll for a district by using "Poll" link.
  
  - Logged users having "Admin" role, can manage districts, questions and choices by using "Districts" link, which provides links/pages to add/update/delete those resources.

  - Unlogged users, can still view poll results of a district in **real-time**, by using "Results" link.


### Programming Paradigms:
The app uses Functional Programming heavily from defining components to implementing logic. FP offers several benefits to us:

![FP-in-action](<./screenshots/functional programming in action.png> "Functional programming in action")

  - Reduced side effects: which leads to more predictable and maintainable code
  - Concise code: FP fosters using expressions over statements, and higher-level abstractions.
  - Better reasoning: by using functions in Mathematical sense (total + deterministic + pure) and Immutability
  - ...

### Users
  - admin@gmail.com && pass
  - aaayoub@gmail.com && pass


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Credits:
Thanks to:
  - [Elixir](https://elixir-lang.org/) team,
  - [James Moore knowthen](https://knowthen.com/category/elixir-and-phoenix-for-beginners/) for his course "Elixir and Phoenix For Beginners" and materials for this project,
  - [Phoenix](https://hexdocs.pm/phoenix/js/index.html) team,
  - [React](https://react.dev/) team,
  - [Next.js](https://nextjs.org/) team,
  - [TypeScript](https://www.typescriptlang.org/) team, 
  - [Ramda](https://ramdajs.com/) team,
  - [Tailwind](https://tailwindcss.com/) team,

  - And everyone who helped me in this journey.
  

<br/>

---
<p align="right">Written with Love ❤️</p>
