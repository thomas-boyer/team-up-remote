# Team Up: Remote Server

## Description
This is half of the Team Up project. The other half--the local server--can be found [here](https://github.com/juliamoses/teamup-server).

---

Team Up is a combination of software that allows teams to upload files faster.

## Pix

!["Homepage"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-1.png)
!["Email verification"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-2.png)
!["File info"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-3.png)

## How it works

- A team member--the **sharer**-- has a large file that needs to be uploaded to the Internet.
- The **sharer** uses the [teamup-server](https://github.com/juliamoses/teamup-server) to split that file into smaller chunks and make those chunks available to other team members over their local area network. There is no limit to the number of team members the chunks can be shared with.
- The other team members--the **sharees**--download one chunk each over LAN.
- Once that download is finished, each **sharee** moves to a different network--whether it be their home or their local Starbucks.
- Each **sharee** visits the remote Team Up server, which is hosted on the Internet, and uploads their chunk.
- After each chunk is uploaded, the chunks are assembled to create the original file.
- The original file is now available to download.
- Due to the significant difference between LAN speeds and Internet upload speeds, this process can save huge amounts of time.

## How to use

- First, clone the [teamup-server](https://github.com/juliamoses/teamup-server) repository. Navigate to its folder and run `npm start`. Follow the instructions given by the electron app.
- Each **sharee** then visits the local IP address displayed by the last screen of the electron app in their browser. Each **sharee** then downloads their assigned chunk as instructed.

---

To locally run the remote server, follow these steps:
- First clone the repository: `git@github.com:thomas-boyer/team-up-remote.git`
- Navigate to the repository's folder.
- Run `npm i` to install the necessary server-side dependencies.
- Run `npm start` to run the server.
- Navigate to the `client` folder in a new shell tab.
- Run `npm i` to install the necessary client-side dependencies.
- Run `npm start` to run the client. Visit `localhost:8088` in your browser to use the app.

---

Finally, follow the instructions given by the app to "upload" your chunks and "download" your assembled file.

**Note**: The app must be connected to the [teamup-server](https://github.com/juliamoses/teamup-server) application to be useful. Ensure that the local server is sending file information to the URL/port the remote server is listening to.

## Major Dependencies
**Server-side**
- cors
- Express
- Express-upload
- mkdirp
- mongodb
- split-file
- ws

**Client-side**
- axios
- bootstrap
- js-file-download
- react
- ws

## Team Members
- [Julia Moses](https://github.com/juliamoses)
- [Thomas Boyer](https://github.com/thomas-boyer)
- [David Eastmond](https://github.com/davideastmond)

