// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })
  ();

  let taxSwitch = document.getElementById("flexSwitchCheckDefault");
    taxSwitch.addEventListener("click",()=>{
        let taxInfo = document.getElementsByClassName("price-with-tax");
        let priceInfo = document.getElementsByClassName("price-without-tax");
        
        for(info of taxInfo){
            if(info.style.display!="inline"){
                info.style.display = "inline";
                for(price of priceInfo){
                    price.style.display="none";
                }

            }else{
                info.style.display="none";
                for(price of priceInfo){
                    price.style.display="inline";
                }
            }
        }
    });