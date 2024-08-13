import React, { useState, useEffect } from 'react'
import { supabase } from './api/dbconfig';

function App() {
  // map과 연동되는 변수가 바로 api 상태변수
  const [gnblist, setData] = useState([]);
  const [gnbview, setView] = useState("글보기내용이 없습니다.");
  const boardtype = ['list', 'view','modify', 'delete']; // 페이지 핸들링 함수
  const [pagestate, pageSet] = useState(boardtype[0]); // 라우터없이 하나 컴포넌트에서 page상태에 따라 노출 -> 자소서 면접 제안 컴포넌트에 사용 할 수 있다

  const apilistview = async () => { // 글보기와 글 목록에 해당됨 // 한계점(limit)을 50점으로
    // supabase  db접속정보를 가지고 서버에 접속하고
    // 데이터가 많으면 order와 limit 메서드로 끊어가지고 오기
  let { data: items, error } = await supabase.from('navidb').select('*').limit(50);


   // .from('your_table_name').select('*') // 데이블을 선택하고 sql select 실행
   // 이후 변수에 구조할당함  
   // await supabase.from('navidb').select('*') 이 처리로 만들어진 결과는 object이고
   // 그 내부안의 key이름 data와 error를 items라는 변수에 error는 error라는 변수에 저장
   // 이것이 구조할당
   // data, error라는 변수는 오타내며 안됨

    console.log(items, Array.isArray(items))

    if(error){
      console.log('Error fetching data:', error);
    } else{
      setData(items) // [] -> [navidb 데이터로 채워짐]
    }

  }
  const apidelet = async (pk) => { // 글삭제 pk가 반드시 필요 -> 매개인자
      
    let { data: items, error } = await supabase
    .from('navidb').delete().eq('wr_id',pk);

    console.log(items, Array.isArray(items))

    if (error) {
      console.error('Error deleting data:', error);
      return;  // 오류가 발생하면 함수 종료
    }
    
    apilistview(); // 삭제이후 갱신된 데이터 다시 가져오기

  }


  // 비동기 삭제 함수 -> pk알려주어야함

  useEffect(()=>{

    apilistview(); // 실행

    return ()=>{

    }
    
  })

  // 이 자리 즉 return 밑에 개발코드 넣으면 적용되지않는다


  return (
    <div className="App">
      {
        pagestate === 'list' ?
        <div className='listpage'>
        <h1>목록페이지 total : {gnblist.length} </h1>
        {
          gnblist.length > 0 ?
          <ul>
            {
              gnblist.map((v, i)=>{
                return(
                  <li key={v.wr_id}>
                    <p onClick={()=>{ setView(v.gnblink); pageSet('view')}}>{v.gnbnm}</p>
                    <button>수정</button>
                    <button onClick={()=>{ apidelet(v.wr_id); }}>삭제</button>
                  </li>
                )
              })
            }
          </ul>
          : <div>로딩화면 제작</div>
        }
        </div>
        : pagestate === 'view' ?
          <div className='viewpage'>
            <h1>글보기(pk반드시존재)</h1>
            <div>
              {gnbview}
            </div>
            <button onClick={()=>{
                pageSet('list');
              }}>목록</button>   
            </div> 
        : pagestate === 'modify' ? 
            <div className='writepage'>
            <h1>글쓰기(pk없음) & 글수정(pk반드시 존재)</h1>
            </div>
        : <div  className='deletpage'>
            <h1>글삭제(pk반드시 존재)</h1>
          </div>
      }
    </div>
  );
}

export default App;
