import React, {useState,useEffect} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Background, Heading, TitleHeading, LightChange, MainCont, Form, InputImg, Input, ListCont, List, ListImg, SingleList, Deletebtn, Check, FooterDesktop, ItemsRemain, CurrentState, ClearCompleted,All, Reorder, Currentstatemobile, Body, InputImgCont, Atrribution, AttributionA, InnerCont, Completed, Active} from './ElementsContainer';
import sun from "../images/icon-sun.svg";
import moon from "../images/icon-moon.svg";
import icon from "../images/icon-check.svg";
import deleteicon from "../images/icon-cross.svg";
import {nanoid} from "nanoid";

const FILTER_MAP = {
    All: () => true,
    Active: task => !task.completed,
    Completed:task => task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP);


const Container = () => {

    const [name, setName] = useState('');
    const [time, setTime] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("All");
    const [countIncomplete, setCountIncomplete] = useState(tasks.length);
    

    useEffect(() => {
        let incomplete = tasks.filter(task => !task.completed); // filter out tasks with completed set to false
        setCountIncomplete(incomplete.length); // update incomplete count number
    }, [tasks])
    
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setTasks(items);
    }

    const clearCompleted = () => {
        setTasks(
            [...tasks.filter(task => !task.completed)]
        );
    }

    const handleDelete = (index) => {
        const data = tasks.filter(task => index !== task.id);
        setTasks(data);
    }

    const handleComplete = (index) => {
        let clickedTask = tasks[index];
        tasks[index] = {...clickedTask, completed: !clickedTask.completed};
        setTasks([...tasks]);
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!name) return;
        addTask(name);
        setName("");
    }
    const addTask = (name) => {
        const newTask = {id:nanoid(), name, completed:false};
        setTasks([...tasks, newTask]);
    }


    const handleChange = (e) => {
        setName(e.target.value)
    }


    const changeTime = () => setTime(!time);

    return (
        <Body bgColor={time}>
            <Background time={time}> 
            </Background>
            <MainCont>
                <InnerCont>
                <Heading>
                    <TitleHeading>TODO</TitleHeading>
                    <div onClick={changeTime}>
                        <LightChange 
                            onClick={changeTime}
                            src={time?sun:moon}
                            alt="light-change"
                        />
                    </div>
                </Heading>
                <Form bgColor={time} onSubmit={handleSubmit}>
                    <InputImgCont>
                        <InputImg color={time} />
                    </InputImgCont>
                    <Input placeholder="Create a new todo.." type="text" 
                    color={time} 
                    autoComplete="off" 
                    value={name} 
                    onChange={handleChange}/>
                </Form>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="character">
                    { (provided) => (
                    <ListCont bgColor={time} {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.filter(FILTER_MAP[filter]).map((task, index) => ( 
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                         {(provided) => (
                        <SingleList {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div style={{width:"10%"}} >
                                <ListImg color={time} 
                                onClick={()=>handleComplete(index)} completed={task.completed}
                                >
                                    <Check src={icon} completed={task.completed}/>
                                </ListImg>
                            </div>
                            <List color={time} completed={task.completed}>
                                <div>
                                    <p>{task.name}</p>
                                </div> 
                                <Deletebtn onClick={() => handleDelete(task.id)} src={deleteicon}/>
                            </List>
                        </SingleList>
                        )}              
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </ListCont>
                    )}
                </Droppable>
                </DragDropContext>
                <FooterDesktop bgColor={time}>
                        <ItemsRemain>{countIncomplete} {countIncomplete <= 1?"Item":"Items"} Left</ItemsRemain>
                        <CurrentState>
                            {
                                FILTER_NAMES.map( name => (
                                    
                                    <All
                                    color={time} 
                                    key={name}
                                    aria-pressed={name===filter}
                                    active={name}
                                    onClick={() => setFilter(name)}>
                                        {name}
                                    </All>
                                ))
                            }
                        </CurrentState>
                        <ClearCompleted onClick={clearCompleted}>Clear Completed</ClearCompleted>
                </FooterDesktop>
                <Currentstatemobile bgColor={time}>
                        <All 
                        onClick={() => setFilter("All")}>
                            All
                        </All>
                        <Active 
                        onClick={() => setFilter("Active")}>
                            Active
                        </Active>
                        <Completed 
                        onClick={() => setFilter("Completed")}>
                            Completed
                        </Completed>
                </Currentstatemobile>
                </InnerCont>
                <Reorder>
                    Drag and drop to reoder List
                </Reorder>
            </MainCont>

           <Atrribution>
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noreferrer">Frontend Mentor</a>. 
            Coded by <AttributionA href="https://ee5.netlify.app">Emmanuel Effiong</AttributionA>.
            </Atrribution>
        </Body>
    )
}

export default Container
