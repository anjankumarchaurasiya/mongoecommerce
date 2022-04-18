 
module.exports = (current,pages) => {

    let output = '';
    if(pages > 1){
        output += '<div class="mt-4 d-flex justify-content-end"><ul class="pagination text-center">';
        if (current === 1) {
        output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        } else {
        output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }

        let i = (Number(current) > 5 ? Number(current) - 4 : 1);

        if (i !== 1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        for (; i <= Number(current) + 4 && i <=Number(pages); i++) 
        { 
            if (i===current) { 
                output +=`<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }

            if (i === Number(current) + 4 && i < pages) 
            {
                output +=`<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }
        if (current === pages) {
            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=${pages}" class="page-link">Last</a></li>`;
        }
        output += '</ul></div>';
    }
    return output;
}