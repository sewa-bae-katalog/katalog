// Time Ago
      const MONTH_NAMES = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];


        function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
            const day = date.getDate();
            const month = MONTH_NAMES[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            let minutes = date.getMinutes();

            if (minutes < 10) {
                // Adding leading zero to minutes
                minutes = `0${ minutes }`;
            }

            if (prefomattedDate) {
                // Today at 10:20
                // Yesterday at 10:20
                return `${ prefomattedDate } at ${ hours }:${ minutes }`;
            }

            if (hideYear) {
                // 10. January at 10:20
                return `${ day } ${ month } at ${ hours }:${ minutes }`;
            }

            // 10. January 2017. at 10:20
            return `${ day } ${ month } ${ year } at ${ hours }:${ minutes }`;
        }


        // --- Main function
        function timeAgo(dateParam) {
            if (!dateParam) {
                return null;
            }

            const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
            const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
            const today = new Date();
            const yesterday = new Date(today - DAY_IN_MS);
            const seconds = Math.round((today - date) / 1000);
            const minutes = Math.round(seconds / 60);
            const isToday = today.toDateString() === date.toDateString();
            const isYesterday = yesterday.toDateString() === date.toDateString();
            const isThisYear = today.getFullYear() === date.getFullYear();


            if (seconds < 5) {
                return 'Now';
            } else if (seconds < 60) {
                return `${ seconds } seconds ago`;
            } else if (seconds < 90) {
                return 'about a minute ago';
            } else if (minutes < 60) {
                return `${ minutes } minutes ago`;
            } else if (isToday) {
                return getFormattedDate(date, 'Today'); // Today at 10:20
            } else if (isYesterday) {
                return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
            } else if (isThisYear) {
                return getFormattedDate(date, false, true); // 10. January at 10:20
            }

            return getFormattedDate(date); // 10. January 2017. at 10:20
        }
      
        function getBarang(url) {
            $.ajaxSetup({ cache: false });
            var item = $("#barang-item");
            
            $(".barang-item").remove();
            item.appendTo("#barang-items");
            $.ajax({
                    type: 'GET',
                    url: url,
                    beforeSend: function (xhr) {
                        xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr);
                    }
                })
                .done(function (data) {
                    myData = JSON.parse(data);
                    
                    for(let i = 0; i < myData.length; i++) {
                       
                        let item = $("#barang-item").clone();

                    
                        item.removeAttr("style");
                        item.find('#card-img').attr('src', myData[i].gambar);
                        item.find('#card-name').html(myData[i].nama_barang);
                        item.find('#card-kategori').html(myData[i].kategori);
                        var nf = Intl.NumberFormat();
                        var x = myData[i].harga;
                        item.find('#card-harga').html('Rp. ' + nf.format(x));
                        var dd = myData[i].updated;
                        var ago = timeAgo(dd);
                        item.find('#card-date').html("<i class='fas fa-clock'></i> : " + ago);
                        item.find('#view-detail').attr("onClick","callModal(\""+myData[i].kode_barang+"\")");

                        item.appendTo("#barang-items");
                        console.log(myData[i]);
                    }
                });
            }

            function callModal(kode) {
            
                $('#DetailModal').modal('show');
                
                $.ajaxSetup({ cache: false });
               
                $.ajax({
                        type: 'GET',
                        url: 'https://kel05.if05a.xyz/api/barang/kode/' + kode,
                        beforeSend: function (xhr) {
                            xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr);
                        }
                    })
                    .done(function (data) {
                        myData = JSON.parse(data);
                        let created = timeAgo(myData[0].created);
                        let updated = timeAgo(myData[0].updated);
    
                        $('#modal-title').html(myData[0].nama_barang);
                        $('#modal-id').html('<strong>Kode : </strong>' + myData[0].kode_barang);
                        $('#modal-name').html('<strong>Nama : </strong>' + myData[0].nama_barang);
                        $('#modal-img').attr('src', myData[0].gambar);
                        $('#modal-kategori').html('<strong>Kategori : </strong>' + myData[0]['kategori']);
                        $('#modal-description').html(myData[0].deskripsi);
                        
                        $('#modal-created').html('<strong>Created : </strong>' + created);
                        $('#modal-updated').html('<strong>Updated : </strong>' + updated);
    
    
                    });
            }
        
        $(document).ready(function () {

            getBarang('https://kel05.if05a.xyz/api/barang');

            $('.form-search').keyup(function() {
                let keyword = $(this).val();
    
                getBarang('https://kel05.if05a.xyz/api/barang/search/'+keyword,'Search')
            });
            
        });

        $("#modal-input-form-image").change(function() {
            readURL(this);
        });
