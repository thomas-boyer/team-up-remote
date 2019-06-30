import React from 'react';

//TODO: Replace path below with the real path!
const Home = () =>
{
  return (
<div>
  <div>
  <ul class="nav">
    <li class="nav-item">
      <a class="nav-link active" href="#">Team Up</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Upload</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Download</a>
    </li>
  </ul>
  </div>

  <div>
    <button type="button" class="btn btn-secondary btn-lg" href="" download="teamup.exe">
      Download
    </button>
  </div>

</div>

  )
}

export default Home;