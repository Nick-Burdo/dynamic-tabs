import {find} from 'lodash';

// add container to be moved
export const movedContainer = {id: 'channel2', type: 'channel', name: 'Channel 2', parent: 'hord2'};

// request all containers are above the one that will be moved
// getAllAbove(movedContainer.type)
// then add them to the initialData
const containers = [
  {id: 'herd1', type:'herd', name: 'Herd 1', parent: null},
  {id: 'herd2', type:'herd', name: 'Herd 2', parent: null},
  {id: 'herd3', type:'herd', name: 'Herd 3', parent: null},
  {id: 'herd4', type:'herd', name: 'Herd 4', parent: null},
  {id: 'superhord1', type:'superhord', name: 'Superhord 1', parent: 'herd2'},
  {id: 'superhord2', type:'superhord', name: 'Superhord 2', parent: 'herd2'},
  {id: 'superhord3', type:'superhord', name: 'Superhord 3', parent: 'herd3'},
  {id: 'superhord4', type:'superhord', name: 'Superhord 4', parent: 'herd3'},
  {id: 'superhord5', type:'superhord', name: 'Superhord 5', parent: 'herd4'},
  {id: 'hord1', type:'hord', name: 'Hord 1', parent: null},
  {id: 'hord2', type:'hord', name: 'Hord 2', parent: 'superhord2'},
  {id: 'hord3', type:'hord', name: 'Hord 3', parent: 'herd2'},
  {id: 'hord4', type:'hord', name: 'Hord 4', parent: 'superhord4'},
];

// expand all parents of container to be moved
const expandParents = (element, collection) => {
  if (element.parent) {
    const parentElement = find(collection, ['id', element.parent]);
    if (parentElement) {
      parentElement.expanded = true;
      if (parentElement.parent) {
        collection = expandParents(parentElement, collection);
      }
    }
  }
  return collection;
};

export const initialData = [].concat(movedContainer, expandParents(movedContainer, containers));
