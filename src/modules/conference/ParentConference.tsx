import * as React from "React";

export class ParentConference extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    // this project is aiming to achieve the following:
    // -Create a tool which can be used in place/combined with skype to create a "silent conference"
    // -people can join a room and hear everyone in that room.
    // -Rooms are predertermined before the event and people are given a passkey for their room
    // ---You can knock on the door of a full room to ask to be let in. To allow teams to ask other teams a question
    // -desktop sharing.
    // -create virtual audio deviced to be able to add a skype call as a room atendee, so people on skype can join
    // -tie in some octane things maybe
    // -include a text chat
    // ---use draft-js rich text box to allow for @'ing and formating. stickers & emoji?
    // -have client and host options as a toggle so its only one package needed.
    // -use as a few extra packages as possilbe.
    // -auto mute all except the person talking? Mute should stop transmitting, not just stop the mic
    // ---big ol toggle button. Maybe it should be push to talk so you cant leave it on by mistake?
    // ---PTT as a toggle option per room or per user.
    // ---room owner can mute all excet them to call to attention


}
