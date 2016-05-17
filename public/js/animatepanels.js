/**
 * Created by pandys01 on 28/04/2016.
 */
$(document).on('click', '.panel-heading span.clickable', function(e){
    var $this = $(this);
    if(!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
});

function searchthis(e){

    var strSearchstring = $(e).val();
    console.log(strSearchstring);

    if ( strSearchstring != ""){
        $("tr").attr("style", function(index) {
            return "display: none;";
        });

        $('tr[id*='+strSearchstring+']').each(function (i, el) {
            $(el).removeAttr("style");
        });
    }
    else{
        $("tr").removeAttr("style");
    }
}
