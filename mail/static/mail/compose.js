document.addEventListener('DOMContentLoaded', function(){
const form = document.querySelector('#compose-form');
form.onsubmit = () =>{
   const to = document.querySelector('#compose-recipients');
   const subject = document.querySelector('#compose-subject');
   const body = document.querySelector('#compose-body');
    if(to.length == 0 || body.length == 0){
        return;
    }
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: to.value,
            subject: subject.value,
            body: body.value
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          console.log(result.status);
          if(result.status == 201){
              load_mailbox('sent');
          }
          else{
                alert(`${result.error}`);
          }
      });
    return false;
}
});