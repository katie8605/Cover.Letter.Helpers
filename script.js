var bar = 0; //progress bar
var uu = 0;
var i = 1; //template tracker
var file = '';
$(document).ready(function() { 
    //four templates
    var temp = ['t1', 't2', 't3', 't4'];
    $('.t2').css('width', '450');
    
    $('.previous_temp').click(function(){
        if(i == 1) {
            $('.previous_temp').addClass('inactiveLink');
        } else {
            $('.next_temp').removeClass('inactiveLink');
        }
        
        $('.'+temp[i]).addClass('sub-shadow')
        $('.'+temp[i]).css('z-index', '-1');
        $('.'+temp[i]).removeClass('shadow')
        $('.'+temp[i]).animate({width: '300'});    
        i--;
        $('.'+temp[i]).css('z-index', '3');
        $('.'+temp[i]).addClass('shadow')
        $('.'+temp[i]).removeClass('sub-shadow')
        $('.'+temp[i]).animate({width: '450'});       
    }); // end previous button
    
    $('.next_temp').click(function(){
        if(i == 2) {
            $('.next_temp').addClass('inactiveLink');
        } else {
            $('.previous_temp').removeClass('inactiveLink');
        }
                
        $('.'+temp[i]).addClass('sub-shadow')
        $('.'+temp[i]).css('z-index', '-1');
        $('.'+temp[i]).removeClass('shadow')
        $('.'+temp[i]).animate({width: '300'});
        i++;
        $('.'+temp[i]).css('z-index', '3');
        $('.'+temp[i]).addClass('shadow')
        $('.'+temp[i]).removeClass('sub-shadow')
        $('.'+temp[i]).animate({width: '450'}); 
    }); // end next button
    
    $('.selected').click(function(){
        //determine which template has been selected
        if(i == 0) {
            file = "templates/first.docx";
        } else if(i == 1) {
            file = "templates/second.docx";   
        } else if(i == 2){
            file ="templates/third.docx";   
        } else if(i == 3){
            file = "templates/fourth.docx";
        }
        
         $(this).attr('href', function() {
            return this.href + '?' +  file ;
        });
    }); // end selected template
                          
//-----------------------------------------DIVIDER------------------------------------------
    
    //date picker
    $('#date').datepicker({
      minDate : 0,
      maxDate : '1y'
    });
    
    //hide sections (for design purposes)
    $('.previous').hide();
    $('.step2').hide();
    $('.step3').hide();
    $('.step4').hide();
    $('.step5').hide();
    
    var match_url = window.location.search;
    var url_pattern = match_url.substring(1, 10);
    if (url_pattern == 'firstName') {
        $('.step1').hide();
        $('.next').hide();
        $('.step5').show();
    }
    
    var section = ['step1', 'step2', 'step3', 'step4'];
    
    $('.next').click(function(){
        //increase progress bar
        bar += 34;
        
        $( "#myBar" ).progressbar({
            value: bar 
        });
        
        $('.'+ section[uu]).hide("slide", { direction: "left" }, 500);
        uu++;
        $('.'+ section[uu]).show("slide", { direction: "right" }, 500);
                   
        if(uu == 3) {
            //hide the next button if the user is on the last section
            $('.next').hide();
            $('.'+ section[0]).show("slide", { direction: "right" }, 500);
            $('.'+ section[1]).show("slide", { direction: "right" }, 500);
            $('.'+ section[2]).show("slide", { direction: "right" }, 500);
        } else {
            $('.previous').show();
            $('.back').hide();
        }
    }); // end next button
               
    $('.previous').click(function(){
        if(uu == 3) {
            $('.next').show();
            $('.'+ section[0]).hide("slide", { direction: "left" }, 500);
            $('.'+ section[1]).hide("slide", { direction: "left" }, 500);
            $('.'+ section[2]).hide("slide", { direction: "left" }, 500);
        }
        
        if(uu == 1) {
            $('.previous').hide();
            $('.back').show();
        }
        
        bar -= 34;
        
        $( "#myBar" ).progressbar({
            value: bar
        });
        $('.'+ section[uu]).hide("slide", { direction: "right" }, 500);
        uu--;
        $('.'+ section[uu]).show("slide", { direction: "left" }, 500);
    }); // end previous button
}); // end ready 
      
   
function loadFile(url,callback){
    JSZipUtils.getBinaryContent(url,callback);
}


function generate() {
    var form = $("#signup");
    form.validate();  
    if( form.valid()) {
         var temp_url = window.location.search;
         var new_file = temp_url.substring(1, temp_url.length);
        
         loadFile(new_file,function(error,content){
            if (error) { throw error };
            var zip = new JSZip(content);
            var doc = new window.docxtemplater().loadZip(zip);
             
             //all data for the cover letter
            doc.setData({
                    first: $('#firstName').val(),
                    last: $('#lastName').val(),
                    current_city: $('#current_city').val(),
                    current_state: $('#current_state').val(),
                    date: $('#date').val(),
                    name: $('#recipient_name').val(),
                    title: $('#title').val(),
                    company: $('#company').val(),
                    street: $('#street').val(),
                    city: $('#city').val(),
                    state: $('#state').val(),
                    zip: $('#zip').val(),
                    opening: $('#opening').val(),
                    qualification: $('#qualification').val(),
                    interest: $('#interest').val(),
                    closing: $('#closing').val(),
                    phone: $('#phone').val(),
                    email: $('#email').val(),    
                });
             
                try {
                    // render the document
                    doc.render()
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({error: e}));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
                }
             
                var out = doc.getZip().generate({
                    type:"blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                })
                
                //Output the document using Data-URI
                saveAs(out,"coverletter.docx")
            })
        
     } 
}
        