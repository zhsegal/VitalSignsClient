$("h1").css('color','blue')

$(document).ready(function() {
    $("#btnFetch").click(function() {
      // disable button
      $(this).prop("disabled", true);
      // add spinner to button
      $(this).html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculating Vital Signs...`
      );

      setTimeout(function(){
        /*submit the form after 5 secs*/
        $('#testForm').submit();
    },5000)
    });
});