export function Tabs({ children }) {
    return <div>{children}</div>;
  }
  
  export function TabsList({ children }) {
    return <div className="flex mb-4">{children}</div>;
  }
  
  export function TabsTrigger({ children }) {
    return <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300">{children}</button>;
  }
  
  export function TabsContent({ children }) {
    return <div>{children}</div>;
  }