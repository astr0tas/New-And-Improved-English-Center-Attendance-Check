Additional features:
      - Using AES and RSA to send and receive encrypted data (but this slows down the server).

Features that worked but can cause real-life issues if the user doesn't careful:
      - Add teachers to sessions when creating a new class (this can leads to teachers have to take multiple continous sessions in different classes in a day without a break).

Features opted out while building the system:
      - Edit class info feature (I really don't know what needed to be changed OVERALL, everything needed to edit a class details or session details is already there.
      The downside is that the user have to change the session details ONE BY ONE).
      - Add classes to new student when first created (the queries needed to realize this feature are too complicated for my tiny brain).
      - Add classes to new teacher when first created (I can do that but that won't sync with the `add new student` feature above :) ).