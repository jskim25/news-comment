$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    var card = $(
      [
        "<div class='card'>",
        "<div class='card-header'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<br>",
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<br>",
        "<a class='btn btn-primary notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='card-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-primary text-center'>",
        "<h4>There are no saved articles. Please click</h4>",
        "<h4><a href='/'>HERE</a></h4>",
        "<h4>to browse available articles.</h4>",
        "</div>",
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        "There are no notes for this article.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        currentNote.children("button").data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    var articleToDelete = $(this).parents(".card").data();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      if (data) {
        initPage();
      }
    });
  }
  function handleArticleNotes(event) {
    var currentArticle = $(this).parents(".card").data();
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr/>",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      bootbox.hideAll();
    });
  }
});
