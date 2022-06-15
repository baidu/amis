/**
 * @file 实现前端文档搜索
 */
import React from 'react';
import axios from 'axios';
import {Icon, Drawer, SearchBox} from 'amis';

let ContextPath = '';

if (process.env.NODE_ENV === 'production') {
  ContextPath = '/amis';
}

export default class DocSearch extends React.Component {
  docs = [];
  ref = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      show: false,
      searchResults: [],
      loadError: false
    };
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.clearValue = this.clearValue.bind(this);
  }

  componentDidMount() {
    axios
      .get(ContextPath + __uri('../docs.json'))
      .then(result => {
        this.docs = result.data.docs;
      })
      .catch(err => {
        this.setState({loadError: true});
      });
  }

  onSearch() {
    let query = this.state.query.trim().toLowerCase();

    if (query === '') {
      this.setState({searchResults: []});
      return;
    }

    let results = [];
    for (let doc of this.docs) {
      let bodyTest = new RegExp(
        query.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'),
        'i'
      );
      const match = bodyTest.exec(doc.body);

      if (match) {
        // 找最近一个 title 作为 hash
        const beforeLines = doc.body
          .substring(0, match.index)
          .split('\n')
          .reverse();
        let hash = '';
        for (const line of beforeLines) {
          if (line.startsWith('##')) {
            hash =
              '#' +
              line
                .trim()
                .replace(/#/g, '')
                .trim()
                .toLowerCase()
                .replace(/ /g, '-');
            break;
          }
        }
        results.push({
          title: doc.title,
          path: doc.path + hash,
          abstract: doc.body
            .substring(Math.max(0, match.index - 20), match.index + 60)
            .replace(
              bodyTest,
              `<strong>${doc.body.substring(
                match.index,
                match.index + query.length
              )}</strong>`
            )
        });
      } else if (doc.title.toLowerCase().indexOf(query) !== -1) {
        results.push({
          title: doc.title,
          path: doc.path,
          abstract: ''
        });
      } else if (doc.path.toLowerCase().indexOf(query) !== -1) {
        results.push({
          title: doc.title,
          path: doc.path,
          abstract: ''
        });
      }
    }
    this.setState({searchResults: results});
  }

  onChange(e) {
    this.setState(
      {
        query: e.currentTarget.value
      },
      () => this.onSearch()
    );
  }

  onOpen() {
    this.setState({
      show: true
    });
  }
  onClose() {
    this.setState({
      show: false
    });
  }

  onEntered() {
    this.ref.current.focus();
  }

  clearValue() {
    this.setState(
      {
        query: ''
      },
      () => {
        this.setState({searchResults: []});
      }
    );
  }

  render() {
    const searchResults = this.state.searchResults;
    const ns = this.props.theme.ns;
    return (
      <>
        {/* <div className={`${ns}TextControl-input Doc-search`}>
          <Icon icon="search" className="icon" />
          <input readOnly placeholder={'搜索...'} onClick={this.onOpen} />
        </div> */}
        <a onClick={this.onOpen}>
          <Icon icon="search" className="icon" />
        </a>

        <Drawer
          className="Doc-searchDrawer"
          overlay
          closeOnOutside
          onHide={this.onClose}
          onEntered={this.onEntered}
          show={this.state.show}
          position={'right'}
        >
          <div className={`${this.props.theme.ns}TextControl-input search-bar`}>
            <Icon icon="search" className="icon" />
            <input
              ref={this.ref}
              placeholder={'搜索...'}
              onChange={this.onChange}
              value={this.state.query}
            />
            {this.state.query ? (
              <a onClick={this.clearValue} className={`${ns}TextControl-clear`}>
                <Icon icon="close" className="icon" />
              </a>
            ) : null}
          </div>

          {searchResults.length > 0 ? (
            <div className="search-result">
              {searchResults.map(item => {
                return (
                  <a href={ContextPath + item.path} key={`list_${item.path}`}>
                    <h4>{item.title}</h4>
                    <p dangerouslySetInnerHTML={{__html: item.abstract}} />
                  </a>
                );
              })}
            </div>
          ) : null}
        </Drawer>
      </>
    );
  }
}
