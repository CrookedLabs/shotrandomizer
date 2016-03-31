var React = require('react');
var jsonObj = require('./../shots.json');
var colors = require('./colors');
var _sample = require('lodash.sample');

var App = React.createClass({
  getInitialState: function () {
    return {
      shotName: null,
      shotIngredients: [],
      bg: _sample(colors),
      running: false
    };
  },

  shuffle: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  randomShot: function () {

    this.setState({
      bg: _sample(colors)
    });

    var jsonStr = JSON.stringify(jsonObj, null, 2);
    var json = JSON.parse(jsonStr);

    this.shuffle(json);
    var shotArr = json.slice(0, 50);

    $('.ingredients').velocity({
      tween: [49, 0]
    }, {
      begin: function () {
        this.setState({
          running: true
        });
      }.bind(this),
      complete: function (complete) {
        this.setState({
          running: false
        });
      }.bind(this),
      duration: 3500,
      easing: "easeOutQuart",
      progress: function (elements, percentComplete, timeRemaining, timeStart, t) {
        var idx = parseInt(t);
        this.setState({
          shotName: shotArr[idx].shotName,
          shotIngredients: shotArr[idx].ingredient
        });
      }.bind(this)
    });
  },

  render: function () {

    var styles = {
      backgroundColor: this.state.bg,
      color: 'white'
    };

    var shotName = null;
    var disclaimer = null;
    if (this.state.shotName) {
      shotName = this.state.shotName;
    } else {
      disclaimer = (<div className="disclaimer">Shot names pulled from around the web and are not a reflection of <a href="http://crookedlabs.co" target="_blank">CrookedLabs</a>.</div>);
      shotName = "Shot Randomizer!";
    }

    return (
      <div className="wrapper" style={styles}>
        <div className="shot-container">
          <div className="shot-name">{shotName}</div>
          <div className="ingredients">{this.state.shotIngredients}</div>
        </div>
        <div className="random-btn-container" onClick={this.state.running ? null : this.randomShot} />
        {disclaimer}
      </div>
      );
  }

});

module.exports = App;
