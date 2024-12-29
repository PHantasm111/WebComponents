import './App.css'
import Card from './Card'


const data = [
  {
    image: "/1.jpg",
    heading: "Card 1",
    subheading: "This is card 1"
  },
  {
    image: "/2.jpg",
    heading: "Card 2",
    subheading: "This is card 2"
  },
  {
    image: "/3.jpg",
    heading: "Card 3",
    subheading: "This is card 3"
  }
]

function App() {
  return (

    <div className='flex items-center justify-center flex-wrap gap-4 h-screen w-screen bg-sky-50'>
      {data.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>

  )
}

export default App
