<template>
  <section class="section-root">
    <h3 class="title">วิดีโอสาธิตการใช้</h3>
    <p class="desc">ดูตัวอย่างวิธีการใช้ในวิดีโอ</p>
    <p class="desc-sub">* หากวิดีโอดูไม่ได้ ลองปิด แล้วเปิดใหม่ดูนะคะ *</p>

    <div class="video-frame">
      <iframe
        class="player"
        src="https://www.youtube.com/embed/zhFuvVKQuwA"
        title="วิดีโอสาธิตการใช้"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>
  </section>
</template>

<script lang="ts">
export default { name: 'RecordVDO' }
</script>

<style scoped>
.section-root {
  padding: 0; /* เอา padding ซ้าย-ขวาออก */
  text-align: left; /* บังคับข้อความชิดซ้าย */
}
.title {
  display: block;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 900;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.18px;
  text-align: left;
  margin-top: 25px;
}
.desc {
  margin: 4px 0 25px;
  color: #1e5898;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
.desc-sub {
  margin: 0 0 10px;
  color: #5b6b7a;
  font-family: 'Noto Looped Thai UI';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
}
/* กรอบวิดีโอให้ responsive 16:9 และโค้งมน */
.video-frame {
  aspect-ratio: 9 / 16;
  width: 85%;
  max-width: 960px; /* จะขยายเต็มกว้างคอลัมน์ได้ */
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
}
.player {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}
</style>
