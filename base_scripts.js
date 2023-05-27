window.onscroll = function() {scrollGradient()};
navGrad = false;

// Get the navbar

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



function scrollGradient() {
    if (window.pageYOffset > 1) {
        // $('#navGrad').animate({opacity: 0}, 0).css("background-image", "linear-gradient(to bottom, rgba(100,100,100,1), rgba(100,100,100,0))").animate({opacity: 1}, 2500);
        $('#navGrad').fadeIn(200);
        console.log("enabling gradinet");
    } else {
        $('#navGrad').fadeOut(200);
    }
    document.getElementById("navGrad").style.opacity = 1;
    console.log(document.getElementById("navGrad").style.backgroundImage);
}
