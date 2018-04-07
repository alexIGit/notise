https://webdesign.tutsplus.com/tutorials/building-a-vertical-timeline-with-css-and-a-touch-of-javascript--cms-26528

==== maket ====
---- html
<section class="timeline">
  <ul>
    <li>
      <div>
        <time>1934</time>
        Some content here
      </div>
    </li>
     
    <!-- more list items here -->
  </ul>
</section>

---- scss
.timeline ul li{
    list-style-type: none;
    position: relative;
    width: 6px;
    margin: 0 auto;
    padding-top: 50px;
    background-color: #ffffff;

    &:after{
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: inherit;
    }

}

---- js