import React, { Component } from 'react';

import { Grid, Button, List, ListItem, Typography, Paper, TextField, InputAdornment } from '@material-ui/core';

import  SearchIcon  from '@material-ui/icons/Search';

import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import UpdateIcon from '@material-ui/icons/Update';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';


class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title : '',
            searchText : '',
            users : [
                { id : '', name : '' }
            ],
        }
    }

    loadUsers() {
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then( response => {
            this.setState({
                ...this.state,
                searchText : '',
                users : response.data
            });
        });
    }

    onSearchTextClear = () => {

        this.setState({
            ...this.state,
            searchText : '',
            users : [],
        });

        this.loadUsers();

    }

    onSearchTextChange = (e) => {

        let updateList = this.state.users;
        let value = e.target.value;

        updateList = Array.isArray(updateList) && updateList.length ? 
            updateList.filter( user => { // this.state.users 가 배열이고 길이가 있으면 filter 처리
                return user.name.toLowerCase().search(value.toLowerCase()) !== -1;
            })
            :
            [];


        if(Array.isArray(updateList) && updateList.length ) {
            // Search Name이 user.name에 포함된 리스트가 존재 하면 state 변경
            this.setState({
                ...this.state,
                searchText : value,
                users : updateList,
            })
        } else {
            // Search Name이 user.name에 포함된 리스트가 존재하지 않으면 state 개체 초기화
            this.setState({
                ...this.state,
                searchText : value,
                users : [],
            })
        }    
        
    }

    // 컴포넌트가 마운트 된 직후 호출되며 데이터 로딩과 같은 작업 등에 재정의
    componentDidMount() {
        this.loadUsers();
    }

    // Props로 부터 State 값을 동기화 하고 싶을 때 사용
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.title !== prevState.title) {
            return { title : nextProps.title }
        }
        return null;
    }

    render() {

        const userList =  Array.isArray(this.state.users) && this.state.users.length ? 
            this.state.users.map( user => {
                return <ListItem key={ user.id } >{ user.name }</ListItem>
            })
            :
            <Typography component='h5' variant='h5'> { 'Empty List' } </Typography> 
            ;   

        return(
            <Paper>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography component='h3' variant='h3'> { this.state.title } </Typography>                     
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField 
                            InputProps={{
                                endAdornment: (
                                    <IconButton sx={{display: this.state.searchText.length > 0 ? "": "none"}} onClick={ this.onSearchTextClear }>
                                        { this.state.searchText ? <ClearIcon /> : ''  }            
                                    </IconButton>
                                ),
                            }}
                            placeholder="Search"
                            type="text"
                            variant="outlined"
                            fullWidth
                            size="small"
                            onChange = { this.onSearchTextChange }
                            value = { this.state.searchText }
                        />    
                    </Grid>
                    <Grid item>
                        <Button onClick={() => this.loadUsers()} variant='contained' color='primary' startIcon={ <UpdateIcon /> } >Load</Button>
                    </Grid>
                </Grid>
                <List>
                    { userList }
                </List>
            </Paper>
        )
    }
}

export default UserList;