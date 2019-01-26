import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const gmailEmail = encodeURIComponent('belaguatrivium@gmail.com');
const gmailPassword = encodeURIComponent('12Azerty');
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
exports.sendContactMessage = functions.firestore.document('messages/{messageID}').onWrite(
  (snap , context) => {
    console.log('on write event');
    const snapshot = snap.after.data();
  // Only send email for new messages.
    console.log('snapshot');
    console.log(JSON.stringify(snapshot));
    console.log('params ok') ; 
    const val = snapshot;
    console.log('getting val');
    console.log(JSON.stringify(val));
    console.log('gmail access') ; 
    console.log(gmailEmail);
    console.log(gmailPassword);
    const mailOptions = {
      to: val.email,
      subject: val.subject,
      html: val.html
    };
    return mailTransport.sendMail(mailOptions).then(
        () => {
       console.log('Mail sent to: '+val.email);
       return;
    }
    );
  } 
);

exports.sendTaskMessage = functions.firestore.document('tasks/{taskId}').onCreate(
  (snap , context) => {
    console.log('on write event task');
    const snapshot = snap.data();
  // Only send email for new messages.
    console.log('snapshot');
    console.log(JSON.stringify(snapshot));
    console.log('params ok') ; 
    const val = snapshot;
    console.log('getting val');
    console.log(JSON.stringify(val));

    if(val.sendEmail == true && val.isClosed == false){
      console.log('gmail access send task') ; 
      console.log(gmailEmail);
      console.log(gmailPassword);
      const mailOptions = {
        to: val.assignedTo.login,
        subject: 'New Taks assigned',
        html: '<p>A new task has been assinged to you : '+val.taskContent+'</p><p>Created at:'+val.createdAt+'</p>'
      };
      return mailTransport.sendMail(mailOptions).then(
          () => {
         console.log('Mail sent to: '+val.email);
         return;
      }
      );
    }
    
  } 
);

exports.sendEmail = functions.firestore.document('messages/{taskId}').onCreate(
  (snap , context) => {
    console.log('on write event task');
    const snapshot = snap.data();
  // Only send email for new messages.
    console.log('snapshot');
    console.log(JSON.stringify(snapshot));
    console.log('params ok') ; 
    const val = snapshot;
    console.log('getting val');
    console.log(JSON.stringify(val));

    if(val.sendEmail == true && val.isClosed == false){
      console.log('gmail access send task') ; 
      console.log(gmailEmail);
      console.log(gmailPassword);
      const mailOptions = {
        to: val.email,
        subject: val.subject,
        html: val.html
      };
      return mailTransport.sendMail(mailOptions).then(
          () => {
         console.log('Mail sent to: '+val.email);
         return;
      }
      );
    }
    
  } 
);
exports.sendUpdatePasswordLink = functions.firestore.document('users/{userID}').onCreate(
  (snap , context) => {
    console.log('on write event task');
    const snapshot = snap.data();
    
  // Only send email for new messages.
    console.log('snapshot');
    console.log(JSON.stringify(snapshot));
    console.log('params ok') ; 
    const val = snapshot;
    console.log('getting val');
    console.log(JSON.stringify(val));

      console.log('gmail access send task') ; 
      console.log(gmailEmail);
      console.log(gmailPassword);
      const mailOptions = {
        to: val.login,
        subject: 'Set password',
        html: '<p>To set your password please visite the link  http://localhost:4200/updatePassword/'+snap.id+'</p>'
      };
      return mailTransport.sendMail(mailOptions).then(
          () => {
         console.log('Mail sent to: '+val.login);
         console.log('<p>To set your password please visite the link  http://localhost:4200/updatePassword/'+snap.id+'</p>');
         return;
      }
      );
    
    
  } 
);
exports.sendTaskConversationMessage = functions.firestore.document('tasks/{taskId}').onUpdate(
  (snap , context) => {
    console.log('on write event task');
    const snapshot = snap.after.data();
  // Only send email for new messages.
    console.log('snapshot');
    console.log(JSON.stringify(snapshot));
    console.log('params ok') ; 
    const val = snapshot;
    console.log('getting val');
    console.log(JSON.stringify(val));

    if(val.sendEmail == true && val.isClosed == false){
      console.log('gmail access send task') ; 
      console.log(gmailEmail);
      console.log(gmailPassword);
      const lastMessage = val.conversation.last();
      if(lastMessage != undefined){
        const mailOptions = {
          to: val.assignedTo.login,
          subject: 'New  message on Taks '+val.taskContent,
          html: '<p>'+lastMessage.author+' said : '+lastMessage.message+'</p>'
        };
        return mailTransport.sendMail(mailOptions).then(
            () => {
           console.log('Mail sent to: '+val.email);
           return;
        }
        );
      } 
    }
  } 
);
