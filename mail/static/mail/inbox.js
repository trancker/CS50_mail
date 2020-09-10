document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
 
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-body').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-body').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(mailbox);
      console.log(emails);
    emails.forEach(element => {
      console.log(element);
      if(mailbox == "sent"){
        from_to = element.recipients;
        to = "To: ";
      }
      else{
        from_to = element.sender;
        to="";
      }
      if(mailbox == "inbox"){
        if(element.read){class_read = "read";}
        else{class_read = "";}
      }
      else{class_read = "";}
      var item = document.createElement("DIV");
      item.className = `card ${class_read} text-dark items border-dark`;
      item.innerHTML = ` <div class="card-body">
      <b>${to}</b><b>${from_to}</b> &nbsp &nbsp | &nbsp <b>Sub: </b> ${element.subject} &nbsp &nbsp | &nbsp ${element.timestamp}
      </div>`;
      document.querySelector("#emails-view").appendChild(item);
      item.addEventListener("click",()=>{
           open_mail(element.id,mailbox);
      });
    }); 
  });
}
function open_mail(id,mailbox){
  fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
      document.querySelector("#emails-view").style.display ="none";
      document.querySelector('#mail-body').style.display = 'block';
      document.querySelector('#mail-text').innerHTML = `
      <b>From: </b> ${email.sender}
      <br>
      <b>To: </b> ${email.recipients}
      <br>
      <b>Subject: </b> ${email.subject}
      <br>
      <b>Time: </b> ${email.timestamp}
      <br><br>
      <div id="reply-btn"></div>
      <hr>
      ${email.body}
      <hr>
      <div id="archive-btn"></div>
      <br>
      </div> `
      if(mailbox == "sent"){
        return;
      }
       let archive = document.createElement('btn');
       archive.className = "btn btn-warning";
       if(email.archived){
         archive.textContent = "Unarchive";
       }
       else{
         archive.textContent = "Archive";
       }
       archive.addEventListener('click',()=>{
        switching_archive(email.id,email.archived,archive);
           
       });
   document.querySelector('#archive-btn').append(archive);
   let reply = document.createElement('btn');
   reply.className = "btn btn-outline-success";
   reply.textContent = "Reply";
   reply.addEventListener('click',()=>{
      mailreply(email.sender,email.subject,email.body,email.timestamp);
   });
   document.querySelector('#reply-btn').append(reply);
   to_read(email.id);
});
}

function mailreply(reply_to,subject,body_text,time){
  compose_email()
  if(subject.slice(0,4) != "Re: "){
    subject = `Re: ${subject}`;
  }
  document.querySelector('#compose-recipients').value = `${reply_to}`;
  document.querySelector('#compose-subject').value = `${subject}`;
  document.querySelector('#compose-body').value = `On ${time} ${reply_to} wrote: ${body_text} \n<end of message>\n`;
}


function to_read(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}


function switching_archive(id,now){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: !now
    })
  })
  window.location.reload();
}
