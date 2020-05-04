function getResults() {
  $("#results").empty();
  $.getJSON("/all", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#results").prepend(
        "<p class='data-entry' data-id=" +
        data._id +
        "><span class='dataTitle' data-id=" +
        data._id +
        "><span data-id=" +
        data.weight +
        "><span data-id=" +
        data.sets +
        ">" +
        data.name +
        "</span><span class='delete'>X</span></p>"
      );
    }
  });
}

getResults();

$(document).on("click", "#make-new", function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      name: $("#name").val(),
      type: $("#type").val(),
      weight: $("#weight").val(),
      sets: $("#sets").val(),
      reps: $("#reps").val(),
      duration: $("#duration").val(),
    },
  }).then(function (data) {
    $("#results").prepend(
      "<p class='data-entry' data-id=" +
        data._id +
        "><span class='dataTitle' data-id=" +
        data._id +
        "><span data-id=" +
        data.weight +
        "><span data-id=" +
        data.sets +
        ">" +
        data.name +
        "</span><span class='delete'>X</span></p>"
    );
    $("#name").val("");
    $("#type").val("");
    $("#weight").val("");
    $("#sets").val("");
    $("#reps").val("");
    $("#duration").val("");
  });
});

$(document).on("click", ".delete", function () {
  var selected = $(this).parent();
  $.ajax({
    type: "DELETE",
    url: "/delete/" + selected.attr("data-id"),

    success: function (response) {
      selected.remove();
      $("#name").val("");
      $("#type").val("");
      $("#weight").val("");
      $("#sets").val("");
      $("#reps").val("");
      $("#duration").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
    },
  });
});

$(document).on("click", ".dataTitle", function () {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function (data) {
      $("#name").val(data.name);
      $("#type").val(data.type);
      $("#weight").val(data.weight);
      $("#sets").val(data.sets);
      $("#reps").val(data.reps);
      $("#duration").val(data.duration);
      $("#action-button").html(
        "<button id='updater' data-id='" + data._id + "'>Update</button>"
      );
    },
  });
});

$(document).on("click", "#updater", function (e) {
  e.preventDefault();
  var selected = $(this);
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      name: $("#name").val(),
      type: $("#type").val(),
      weight: $("#weight").val(),
      sets: $("#sets").val(),
      reps: $("#reps").val(),
      duration: $("#duration").val(),
    },
    success: function (data) {
      $("#name").val("");
      $("#type").val("");
      $("#weight").val("");
      $("#sets").val("");
      $("#reps").val("");
      $("#duration").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
      getResults();
    },
  });
});
