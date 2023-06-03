window.onscroll = function() {scrollGradient()};
navGrad = false;

// Get the navbar

$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = '/common-html/' + $(this).data('include') + '.html'
        $(this).load(file)
    })
})

function getCssValuePrefix()
{
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background)
        {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
}

$('.navbar').stop();

function scrollGradient() {
    if (navGrad && window.pageYOffset < 1) {
        if (!$('.navbar').is(':animated')) {
            $('.navbar').stop();
            $('.navbar').animate({ 
                boxShadow: '0px -50px 10px 0px rgba(128,128,128,1)'
            }); 
            navGrad = false;
            console.log("navGrad disabled");
        }
    } else if (navGrad == false && window.pageYOffset >= 1) {
        if (!$('.navbar').is(':animated')) {
            $('.navbar').stop();
            $('.navbar').animate({ 
                boxShadow: '0px 5px 10px 0px rgba(128,128,128,1)'
            }); 
            navGrad = true;
            console.log("navGrad enabled");
        }
    }
    
    
    console.log(window.pageYOffset + " - " + $('.navbar').is(':animated'));
}

function hamburgerDetection() {
    navlogoText = document.getElementById('navLogoText');
    if ((navlogoText.offsetHeight / navlogoText.style.lineHeight) > 0.9) {
        navlogoText.style.display = 'none';
    } else {
        navlogoText.style.display = 'block';
    
    }

    console.log("changedHamburger");
}

function loadHamburger(){
    window.onresize = hamburgerDetection();
}

window.onload = loadHamburger();