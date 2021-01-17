import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import projectService from '../../services/projects';
import { ProjectState, ProjectSortValues, NewProjectPayload } from '../types';
import { getErrorMsg } from '../../utils/helperFuncs';

interface InitialProjectsState {
  projects: ProjectState[];
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchError: string | null;
  submitLoading: boolean;
  submitError: string | null;
  sortBy: ProjectSortValues;
}

const initialState: InitialProjectsState = {
  projects: [],
  fetchStatus: 'idle',
  fetchError: null,
  submitLoading: false,
  submitError: null,
  sortBy: 'newest',
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectState[]>) => {
      state.projects = action.payload;
      state.fetchStatus = 'succeeded';
      state.fetchError = null;
    },
    setFetchProjectsLoading: (state) => {
      state.fetchStatus = 'loading';
      state.fetchError = null;
    },
    setFetchProjectsError: (state, action: PayloadAction<string>) => {
      state.fetchStatus = 'failed';
      state.fetchError = action.payload;
    },
    clearFetchProjectsError: (state) => {
      state.fetchError = null;
    },
    addProject: (state, action: PayloadAction<ProjectState>) => {
      state.projects.push(action.payload);
      state.submitLoading = false;
      state.submitError = null;
    },
    setSubmitProjectLoading: (state) => {
      state.submitLoading = true;
      state.submitError = null;
    },
    setSubmitProjectError: (state, action: PayloadAction<string>) => {
      state.submitLoading = false;
      state.submitError = action.payload;
    },
    clearSubmitProjectError: (state) => {
      state.submitError = null;
    },
    sortProjectsBy: (state, action: PayloadAction<ProjectSortValues>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setProjects,
  setFetchProjectsLoading,
  setFetchProjectsError,
  clearFetchProjectsError,
  addProject,
  setSubmitProjectLoading,
  setSubmitProjectError,
  clearSubmitProjectError,
  sortProjectsBy,
} = projectsSlice.actions;

export const fetchProjects = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setFetchProjectsLoading());
      const allProjects = await projectService.getProjects();
      dispatch(setProjects(allProjects));
    } catch (e) {
      dispatch(setFetchProjectsError(getErrorMsg(e)));
    }
  };
};

export const createNewProject = (projectData: NewProjectPayload): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitProjectLoading());
      const newProject = await projectService.createProject(projectData);
      dispatch(addProject(newProject));
    } catch (e) {
      dispatch(setSubmitProjectError(getErrorMsg(e)));
    }
  };
};

export const selectProjectsState = (state: RootState) => state.projects;

export const selectProjectById = (state: RootState, projectId: string) => {
  return state.projects.projects.find((p) => p.id === projectId);
};

export default projectsSlice.reducer;
