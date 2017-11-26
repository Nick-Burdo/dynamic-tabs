import React, { Component } from 'react';
import {find} from 'lodash';
//https://fritz-c.github.io/react-sortable-tree/
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
  getNodeAtPath,
  removeNodeAtPath,
  addNodeUnderParent,
  insertNode,
  toggleExpandedForAll
} from 'react-sortable-tree';
import { initialData, movedContainer } from '../../data/initialData';

class DummyList extends Component {
  constructor(props) {
    super(props);

    this.movedPath = null;

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: getTreeFromFlatData({
        flatData: initialData.map(node => ({...node, title: node.name})),
        getKey: node => node.id,
        getParentKey: node => node.parent,
        rootKey: null,
      }),
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleMoveToRoot = this.handleMoveToRoot.bind(this);
    this.handleMoveThere = this.handleMoveThere.bind(this);
    this.handleDnD = this.handleDnD.bind(this);
  }

  handleCancel() {
    // TODO handle cancel action
    alert('Return to the previous page ');
  }

  handleSave() {
    const flatData = getFlatDataFromTree({
      treeData: this.state.treeData,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
    }).map(({ node, path }) => ({
      id: node.id,
      name: node.name,
      parent: path.length > 1 ? path[path.length - 2] : null,
    }));
    const moved = find(flatData, ['id', movedContainer.id]);

    // TODO handle save action
    alert(`Save ${moved.parent ? moved.parent : 'sensorspace'} as parent for ${movedContainer.name}  then go to them`);
  }

  handleMoveToRoot({node}) {
    let { treeData } = this.state;
    const moved = getNodeAtPath({
      treeData,
      path: this.movedPath,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
    });
    moved.node.parent = null;
    treeData = removeNodeAtPath({
      treeData,
      path: this.movedPath,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
    });
    treeData = insertNode({
      treeData,
      depth: 0,
      //minimumTreeIndex: 0, // insert to 1-st position
      newNode: moved.node,
      getNodeKey: ({ node }) => node.id,
    }).treeData;

    console.log('treeData:', treeData);

    this.setState({
      treeData: toggleExpandedForAll({treeData, expanded: false})
    });
  }

  handleMoveThere({node}) {
    let { treeData } = this.state;
    const moved = getNodeAtPath({
      treeData,
      path: this.movedPath,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
    });
    moved.node.parent = node.id;
    treeData = removeNodeAtPath({
      treeData,
      path: this.movedPath,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
    });
    this.setState({
      treeData: addNodeUnderParent({
        treeData,
        newNode: moved.node,
        parentKey: node.id,
        getNodeKey: ({ node }) => node.id,
        ignoreCollapsed: false,
        expandParent: true,
      }).treeData,
    });
  }

  handleDnD({ treeData, node, nextPath }) {
    node.parent = nextPath.length > 1 ? nextPath[nextPath.length - 2] : null;
    this.setState({
      treeData
    })
  }

  render() {
    const { treeData, searchString, searchFocusIndex, searchFoundCount } = this.state;

    const customSearchMethod = ({ node, searchQuery }) =>
    searchQuery &&
    node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex: searchFocusIndex !== null ?
        (searchFoundCount + searchFocusIndex - 1) % searchFoundCount :
        searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex: searchFocusIndex !== null ?
        (searchFocusIndex + 1) % searchFoundCount :
          0,
      });

    const generateNodeProps = ({ node, path }) => {
      const colors = {
        herd: 'red',
        superhord: 'maroon',
        hord: 'seagreen',
        channel: 'sandybrown'
      };

      if (node.id === movedContainer.id) {
        this.movedPath = path;
      }

      let buttons = [];
      if (node.id !== movedContainer.id) {
        buttons = [<button onClick={() => this.handleMoveThere({node, path})}>Move here</button>]
      } else {
        if (node.parent) {
          buttons = [<button onClick={() => this.handleMoveToRoot({node, path})}>Move to root</button>]
        }
      }

      return {
        style: {
          color: colors[node.type],
        },
        buttons
      }
    };

    return (
      <div style={{ height: '80vh', background: '#333',padding: 1 }}>
        <h1 style={{color: '#fff', textAlign: 'center'}}>
          Move {movedContainer.name} to...
        </h1>
        <hr/>
        <h2>
          <span style={{padding: '0 46px', color: '#fff'}}>
            Sensorspace 1
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            id="find-box"
            type="text"
            placeholder="Search..."
            style={{ fontSize: '1rem' }}
            value={searchString}
            onChange={event =>
              this.setState({ searchString: event.target.value })}
          />

          <span style={{display: searchFoundCount ? 'inline' : ' none'}}>
            <button type="button" onClick={selectPrevMatch}>
              &lt;
            </button>

            <button type="button" onClick={selectNextMatch}>
              &gt;
            </button>

            <span style={{color: '#fff', fontSize: 16}}>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="button" onClick={this.handleCancel}>Cancel</button>
          <button type="button" onClick={this.handleSave}>Save</button>
        </h2>
        <div style={{ height: '60vh'}}>
          <SortableTree
            treeData={treeData}
            onChange={treeData => this.setState({ treeData })}
            onMoveNode={this.handleDnD}
            canDrag={({ node }) => node.id === movedContainer.id}
            generateNodeProps={generateNodeProps}
            getNodeKey={({node}) => node.id}
            searchMethod={customSearchMethod}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })}
          />
        </div>
      </div>
    );
  }
}

export default DummyList;

 
