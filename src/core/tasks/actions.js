require('es6-promise').polyfill();
require('isomorphic-fetch');
import { getDeletedTask } from './selectors';
import { taskList } from './task-list';
import {
  CREATE_TASK_ERROR,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
  DELETE_TASK_SUCCESS,
  FILTER_TASKS,
  LOAD_TASKS_SUCCESS,
  UNDELETE_TASK_ERROR,
  UNLOAD_TASKS_SUCCESS,
  UPDATE_TASK_ERROR,
  UPDATE_TASK_SUCCESS
} from './action-types';

export function createTask(title) {
  return dispatch => {
      fetch('http://localhost:8080/careaware-legacy-clairvia-tomcat-edition-0.0.1-SNAPSHOT/service/SURROUND/legacy/v1/schedule/facility/MQ==/profiles/NA==,NQ==,Ng==/items?startTimestamp=1484225100000&endTimestamp=1484268300000&publishedOnly=false')
      	.then(response => {
      		if (response.status >= 400) {
      			throw new Error("Bad response from server");
      		}
          return response.json();
      	})
      	.then(json => {
          // parse our json
          // var collection = eval(json.blob());
          json.forEach(function(item) {
            console.log(item.employeeIdAlias);
          });
      	});

        taskList.push({completed: false, title})
          .catch(error => dispatch(createTaskError(error)));
    };
}

export function createTaskError(error) {
  return {
    type: CREATE_TASK_ERROR,
    payload: error
  };
}

export function createTaskSuccess(task) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: task
  };
}

export function deleteTask(task) {
  return dispatch => {
    taskList.remove(task.key)
      .catch(error => dispatch(deleteTaskError(error)));
  };
}

export function deleteTaskError(error) {
  return {
    type: DELETE_TASK_ERROR,
    payload: error
  };
}

export function deleteTaskSuccess(task) {
  return {
    type: DELETE_TASK_SUCCESS,
    payload: task
  };
}

export function undeleteTask() {
  return (dispatch, getState) => {
    const task = getDeletedTask(getState());
    if (task) {
      taskList.set(task.key, {completed: task.completed, title: task.title})
        .catch(error => dispatch(undeleteTaskError(error)));
    }
  };
}

export function undeleteTaskError(error) {
  return {
    type: UNDELETE_TASK_ERROR,
    payload: error
  };
}

export function updateTaskError(error) {
  return {
    type: UPDATE_TASK_ERROR,
    payload: error
  };
}

export function updateTask(task, changes) {
  return dispatch => {
    taskList.update(task.key, changes)
      .catch(error => dispatch(updateTaskError(error)));
  };
}

export function updateTaskSuccess(task) {
  return {
    type: UPDATE_TASK_SUCCESS,
    payload: task
  };
}

export function loadTasksSuccess(tasks) {
  return {
    type: LOAD_TASKS_SUCCESS,
    payload: tasks
  };
}

export function filterTasks(filterType) {
  return {
    type: FILTER_TASKS,
    payload: {filterType}
  };
}

export function loadTasks() {
  return (dispatch, getState) => {
    const { auth } = getState();
    taskList.path = `tasks/${auth.id}`;
    taskList.subscribe(dispatch);
  };
}

export function unloadTasks() {
  taskList.unsubscribe();
  return {
    type: UNLOAD_TASKS_SUCCESS
  };
}
