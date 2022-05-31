import React,{ useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {

    const [keyword, setKeyword] = useState('')

    const submitHandler= (e) => {
        e.preventDefault();

        if(keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <Form inline onSubmit={submitHandler}>
            <Form.Control type='text' name='q'
            onChange={(e) => setKeyword(e.target.value)} placeholder='Поиск товаров' className='searchbox mr-sm-2 ml-sm-0'>
            </Form.Control>
            <Button type='submit' variant='outline-success' className='searchbox-btn p-2'>Поиск</Button>
        </Form>
    )
}

export default SearchBox
