import React, { useEffect ,useState} from 'react'

const Topsellers = () => {
    const [books,setBooks] = useState([]);

    useEffect(() => {
            fetch("books.json")
            .then(res=>res.json())
            .then((data)=>setBooks(data));

    }, []);
            console.log(books);
  return (
    <div>
       Topsellers
    </div>
  )
}

export default Topsellers
