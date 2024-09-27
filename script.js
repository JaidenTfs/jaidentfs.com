//Javascript!
use App\Livewire\Dashboard;
use App\Livewire\ShowPosts;
use App\Livewire\ShowUsers;
 
Route::get('index.html', Dashboard::class);
 
Route::get('portfolio.html', ShowPosts::class);
 
Route::get('contact.html', ShowUsers::class);