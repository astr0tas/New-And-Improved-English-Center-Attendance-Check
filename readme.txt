This project is just a prove a concept.

Features that worked but can cause real-life issues and the USER MUST BE CAREFUL:
      - Add teachers to sessions when creating a new class (this can leads to teachers have to take multiple continous sessions in different classes in a day without a break).
      - Deactivating/reactivating classes (this can leads to schedules overlapping with other classes, which can lead to serious problems).
      - Add a new session to a class (this can leads to students have to take multiple continous sessions in a day without a break).

Basic security and encryption methods:
      - Prevented SQL Injection, XSS protection, CSRF protection (I only set CORS to specfic domain, I can try Anti-CSRF Tokens as well but I'm lazy about it :P );
      - Using AES and RSA to send and receive encrypted data (but this slows down the server and also the AES key can be fetched intentionally but the user need to be logged in in order to do that).

Features opted out while building the system:
      - Edit class info feature (I really don't know what needed to be changed OVERALL, everything needed to edit a class details or session details is already there.
      The downside is that the user have to change the session details ONE BY ONE).
      - Add classes to new student when first created (the queries needed to realize this feature are too complicated for my tiny brain).
      - Add classes to new teacher when first created (I can do that but that won't sync with the `add new student` feature above :P ).
