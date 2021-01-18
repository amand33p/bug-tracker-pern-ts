import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProjectById,
  deleteProject,
} from '../../redux/slices/projectsSlice';
import { selectAuthState } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import MembersCard from './MembersCard';
import BugsCard from './BugsCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDateTime } from '../../utils/helperFuncs';

import {
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
} from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

interface ParamTypes {
  projectId: string;
}

const ProjectDetailsPage = () => {
  const classes = useMainPageStyles();
  const { projectId } = useParams<ParamTypes>();
  const history = useHistory();
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState('');
  const [viewMembers, setViewMembers] = useState(false);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const { user } = useSelector(selectAuthState);
  const project = useSelector((state: RootState) =>
    selectProjectById(state, projectId)
  );

  if (!project) {
    return <div>404: Project not found.</div>;
  }

  const { id, name, members, createdAt, updatedAt, createdBy } = project;

  const isAdmin = createdBy.id === user?.id;

  const handleDeleteProject = () => {
    dispatch(deleteProject(id, history));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.detailsHeader}>
        <div className={classes.flexHeader}>
          {!editNameOpen ? (
            <Typography variant="h4" color="secondary">
              <strong>{name}</strong>
            </Typography>
          ) : (
            <h4>ok</h4>
          )}
          {isAdmin && !editNameOpen && (
            <IconButton
              size="small"
              style={{ marginLeft: '0.4em' }}
              onClick={() => setEditNameOpen(true)}
            >
              <EditIcon color="primary" style={{ fontSize: '1.7em' }} />
            </IconButton>
          )}
        </div>
        <Divider style={{ margin: '0.5em 0' }} />
        <Typography variant="subtitle2" color="secondary">
          Admin: <strong>{createdBy.username}</strong>
        </Typography>
        <Typography variant="subtitle2" color="secondary">
          Created At: <em>{formatDateTime(createdAt)}</em>
        </Typography>
        {createdAt !== updatedAt && (
          <Typography variant="subtitle2" color="secondary">
            Updated At: <em>{formatDateTime(updatedAt)}</em>
          </Typography>
        )}
        <div className={classes.btnsWrapper}>
          {members.length > 1 && (
            <Button
              color="secondary"
              variant="outlined"
              startIcon={viewMembers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setViewMembers(!viewMembers)}
              style={{ marginRight: '1em' }}
            >
              {viewMembers ? 'Hide Members' : 'View Members'}
            </Button>
          )}
          {!isAdmin && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<ExitToAppOutlinedIcon />}
            >
              Leave Project
            </Button>
          )}
          {isAdmin && (
            <>
              <Button
                color="primary"
                variant="contained"
                startIcon={<GroupAddOutlinedIcon />}
                style={{ marginRight: '1em' }}
              >
                Add Members
              </Button>
              <ConfirmDialog
                title="Confirm Delete Project"
                contentText="Are you sure you want to permanently delete your project?"
                actionBtnText="Delete Project"
                triggerBtn={{
                  type: 'normal',
                  text: 'Delete Project',
                  icon: DeleteOutlineIcon,
                }}
                actionFunc={handleDeleteProject}
              />
            </>
          )}
        </div>
        {members.length > 1 && (
          <MembersCard
            members={members}
            viewMembers={viewMembers}
            isAdmin={isAdmin}
            adminId={createdBy.id}
          />
        )}
      </Paper>
      <BugsCard projectId={projectId} />
    </div>
  );
};

export default ProjectDetailsPage;
