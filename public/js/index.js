$('#test').click(function() {
    $.ajax({
        type: "POST",
        url: "/search",
        data: { name: "Jack+Johnson" },
        success: function(data)
        {
            if (data.result) {
                $("#preview").html("<p>"+data.result+"<\p>");
                $("#submit").prop("disabled", false);
                $("#compileLoader").hide("fast");
            } else {
                window.location = data;
            }
        },
        failure: function()
        {
        },
        complete: function()
        {
        }
    });
});

fn playlist(idx) {
    alert(playlist);
    
    $.ajax({
        type: "POST",
        url: "/setPlaylist",
        data: { idx: idx },
        success: function(data)
        {
            alert(data);
            /*if (data.result) {
                $("#preview").html("<p>"+data.result+"<\p>");
                $("#submit").prop("disabled", false);
                $("#compileLoader").hide("fast");
            } else {
                window.location = data;
            }*/
            $('#player').attr("src", data);
            $('#player').play();
        },
        failure: function()
        {
        },
        complete: function()
        {
        }
    });
}
