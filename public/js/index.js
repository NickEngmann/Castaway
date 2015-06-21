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
