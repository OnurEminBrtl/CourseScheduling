## Courses.csv

1. Kursların öğretmenleri belli.
2. Sınıfları ve ne zaman olacakları belli değil.
3. Aynı yılda olan kurslar birbirleriyle çakışamazlar.

## Classroom.csv

1. Sınıfların belirli bir kapasitesi var, buna göre kurslar bu sınıfa girebilirler.
2. Her günün bir sabahı bir de akşamı var, bu sebeple bir gün içerisinde bir sınıf iki kez kullanılabilir oluyor. Haftaiçi toplam 5 gün olduğu için, toplam da 10 kez kullanılabilir oluyor.

## Busy.csv

1. Bazı öğretmenler, bazı zamanlarda müsait olmuyor, onlara göre ayarlanmalı.

## Service.csv

1. Departmanlara atanan service olarak bulunan bazı dersler var ve bunların günleri önceden belirli. Bu nedenle o derslerin o zamana atanması zorunlu.

---

1. Tüm bu kısıtlamalar bir dosyadan alınmalı. Yani CSV dosyalarından.
2. En son algoritmalar kurulduğunda program web sayfasından görüntülenebilmeli.
3. Aynı departmandan dersler arasında herhangi bir kesişme olmamalı.
4. Bir ders için olası bir program ayarlanamazsa **There is no way to make a schedule for the department.** olarak bir hata mesajı yazdırmalı.
5. Sonrasında başarılı bir ders programı için kullanıcıya GUI aracılığıyla derslik sayısını arttırması önerilebilir.

---

## Conditions

<!-- 1. Courses in the same year should not be intersected with each other.
2. There are some service courses. The time slot of these courses is fixed and predefined. Therefore, you cannot assign different time slots for those courses other than the requested time slot. -->

3. Some instructors may not be available for some time slots. Thus, your program should respect these busy time slots for the respective courses.
4. In this schedule, there should not be any intersection between courses for a year of the curriculum and respect all constraints.
5. If your program cannot find any possible schedule it will print an error message “There is no way to make a schedule for the department.”
6. You may suggest the user to increasing the number of classrooms via GUI, to find a course schedule successfully.
