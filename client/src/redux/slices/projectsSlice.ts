import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import projectService from '../../services/projects';
import { ProjectState, ProjectSortValues } from '../types';
import { getErrorMsg } from '../../utils/helperFuncs';

interface InitialProjectsState {
  projects: ProjectState[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortBy: ProjectSortValues;
}

const initialState: InitialProjectsState = {
  projects: [],
  status: 'idle',
  error: null,
  sortBy: 'newest',
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectState[]>) => {
      state.projects = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setProjectsLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setProjectsError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearProjectsError: (state) => {
      state.error = null;
    },
    sortProjectsBy: (state, action: PayloadAction<ProjectSortValues>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setProjects,
  setProjectsLoading,
  setProjectsError,
  clearProjectsError,
  sortProjectsBy,
} = projectsSlice.actions;

export const fetchProjects = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setProjectsLoading());
      const projectData = await projectService.getProjects();
      dispatch(setProjects(projectData));
    } catch (e) {
      dispatch(setProjectsError(getErrorMsg(e)));
    }
  };
};

export const selectProjectsState = (state: RootState) => state.projects;

export const selectProjectById = (state: RootState, projectId: string) => {
  return state.projects.projects.find((p) => p.id === projectId);
};

export default projectsSlice.reducer;