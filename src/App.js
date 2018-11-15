import React from "react";
import "./App.css";
import {
  CellMeasurerCache,
  CellMeasurer,
  AutoSizer,
  WindowScroller,
  Masonry
} from "react-virtualized";
import createCellPositioner from "./createCellPositioner";
import axios from "axios";

// const list = Array(1000);

class App extends React.Component {
  constructor(props) {
    super(props);

    this._columnCount = 0;
    this._cache = new CellMeasurerCache({
      defaultHeight: 400,
      defaultWidth: 250,
      fixedHeight: true,
      fixedWidth: true
    });

    this.state = {
      gutterSize: 10,
      overscanByPixels: 0,
      height: 400,
      columnWidth: 250,
      films: [],
      isDataLoaded: false
    };
  }

  componentWillMount() {
    axios.get("http://localhost:3001/api/films").then(res => {
      this.setState({ films: res.data, isDataLoaded: true });
    });
  }

  render() {
    const { columnWidth, height, gutterSize, overscanByPixels } = this.state;

    return (
      <div>
        {!this.state.isDataLoaded ? (
          <h2>Loading...</h2>
        ) : (
          <div className="window">
            <WindowScroller
              overscanByPixels={overscanByPixels}
              // className="window"
            >
              {this._renderAutoSizer}
            </WindowScroller>
          </div>
        )}
      </div>
    );
  }

  _calculateColumnCount = () => {
    const { columnWidth, gutterSize } = this.state;

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  };

  _cellRenderer = ({ index, key, parent, style }) => {
    const { columnWidth } = this.state;
    const film = this.state.films[index];
    console.log(film);
    return (
      <CellMeasurer
        cache={this._cache}
        index={index}
        key={key}
        parent={parent}
        className="cellMes"
      >
        <div className="cell" style={{ ...style, width: columnWidth }}>
          <div className="content">
            <img src={film.avatar} />
            <h3 style={{ margin: 0 }}>{film.title}</h3>
            <p style={{ margin: 0 }}>{film.description}</p>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  _initCellPositioner = () => {
    if (typeof this._cellPositioner === "undefined") {
      const { columnWidth, gutterSize } = this.state;

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize
      });
    }
  };

  _onResize = ({ width }) => {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  };

  _renderAutoSizer = ({ height, scrollTop }) => {
    this._height = height;
    this._scrollTop = scrollTop;

    const { overscanByPixels } = this.state;

    return (
      <AutoSizer
        disableHeight
        height={height}
        onResize={this._onResize}
        overscanByPixels={overscanByPixels}
        scrollTop={this._scrollTop}
      >
        {this._renderMasonry}
      </AutoSizer>
    );
  };

  _renderMasonry = ({ width }) => {
    this._width = width;

    this._calculateColumnCount();
    this._initCellPositioner();

    const { height, overscanByPixels } = this.state;

    return (
      <Masonry
        autoHeight={true}
        cellCount={this.state.films.length}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={this._height}
        overscanByPixels={overscanByPixels}
        ref={this._setMasonryRef}
        scrollTop={this._scrollTop}
        width={width}
      />
    );
  };

  _setMasonryRef = ref => {
    this._masonry = ref;
  };

  _resetCellPositioner() {
    const { columnWidth, gutterSize } = this.state;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize
    });
  }
}

export default App;
